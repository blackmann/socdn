import express from 'express'
import cors from 'cors'
import * as mongodb from 'mongodb'
import multer from 'multer'

const LOCAL_DB = 'mongodb://localhost:27017/socdn'

const upload = multer({
  dest: './socdn_files',
  limits: { fileSize: 2_000_000_000 },
})
const client = new mongodb.MongoClient(process.env.MONGO_URL || LOCAL_DB)
const db = client.db()

const app = express()
app.use(cors())

app.use((req, res, next) => {
  // logger
  // doesn't work well for async callbacks
  // TODO: Investigate
  const t = Date.now()
  const path = req.url
  next()

  const time = Date.now() - t

  console.log(
    `${res.statusCode} ${req.method.padEnd(7, ' ')} ${path.padEnd(
      40,
      ' '
    )} ${time}ms`
  )
})

app.use('/admin', express.static('./admin'))

app.get('/files', async (req, res) => {
  const folder = checkForFolderName(req)
  if (!folder) {
    return
  }

  const files = await db.collection('files').find({ folder }).toArray()
  res.json(files)
})

app.post('/files', upload.array('files'), async (req, res) => {
  const folder = checkForFolderName(req)
  if (!folder) {
    return
  }

  const filesCollection = db.collection('files')
  const revisionsCollection = db.collection('revisions')
  const names = req.files.map((file) => file.originalname)
  const existingFiles = await filesCollection
    .find({ folder, name: { $in: names } })
    .toArray()

  const existing = Object.fromEntries(existingFiles.map((v) => [v.name, true]))
  const results = []

  for (const file of req.files) {
    if (!existing[file.originalname]) {
      // new file, create revision
      // inserting one-by-one is fine. it's not a public upload server
      const f = await filesCollection.insertOne({
        name: file.originalname,
        created_at: new Date(),
        updated_at: new Date(),
        folder,
        size: file.size,
      })

      await revisionsCollection.insertOne({
        file: f.insertedId,
        version: 1,
        created_at: new Date(),
        size: file.size,
      })

      results.push(await filesCollection.findOne({ _id: f.insertedId }))
    } else {
      const f = await filesCollection.findOne({ name: file.originalname })
      await filesCollection.updateOne(
        { _id: f._id },
        { $set: { updated_at: new Date(), size: file.size } }
      )

      const [previousRevision] = await revisionsCollection
        .find({ file: f._id })
        .sort({ created_at: -1 })
        .limit(1)
        .toArray()

      await revisionsCollection.insertOne({
        file: f._id,
        version: previousRevision.version + 1,
        created_at: new Date(),
        size: file.size,
      })

      results.push(await filesCollection.findOne({ _id: f._id }))
    }
  }

  res.status(201).json(results)
})

app.use('/files/:id', async (req, res) => {
  const file = await db
    .collection('files')
    .findOne({ _id: mongodb.ObjectId.createFromHexString(req.params['id']) })

  const revisions = await db
    .collection('revisions')
    .find({ file: file._id })
    .toArray()

  res.json({ file, revisions })
})

app.use('/folders', async (req, res) => {
  const aggregate = await db
    .collection('files')
    .aggregate([{ $group: { _id: '$folder' } }])
    .toArray()

  res.json(aggregate.map((f) => ({ name: f._id })))
})

app.use('/_/:fn', (req, res) => {
  //
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('App serving at http://localhost:' + port)
})

function checkForFolderName(req) {
  const folder = req.query['folder']

  if (!folder) {
    res.status(400).json({ detail: 'specify folder query parameter' })
    return false
  }

  return folder
}
