import express from 'express'
import cors from 'cors'
import * as mongodb from 'mongodb'
import multer from 'multer'
import path from 'path'
import onFinished from 'on-finished'

const LOCAL_DB = 'mongodb://127.0.0.1:27017/socdn'

const upload = multer({
  dest: './socdn_files',
  limits: { fileSize: 2_000_000_000 },
})

const client = new mongodb.MongoClient(process.env.MONGO_URL || LOCAL_DB)
const db = client.db()

const app = express()
app.use(cors())

app.use(async (req, res, next) => {
  // logger
  const t = Date.now()
  const path = req.url

  onFinished(res, () => {
    const time = Date.now() - t

    console.log(
      `${res.statusCode} ${req.method.padEnd(7, ' ')} ${path.padEnd(
        40,
        ' '
      )} ${time}ms`
    )
  })

  next()
})

app.use('/admin', express.static('./admin'))

app.get('/files', async (req, res) => {
  const folder = checkForFolderName(req, res)
  if (!folder) {
    return
  }

  const files = await db.collection('files').find({ folder }).toArray()
  res.json(files)
})

app.post('/files', upload.array('files'), async (req, res) => {
  const folder = checkForFolderName(req, res)
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

      const { insertedId: revisonId } = await revisionsCollection.insertOne({
        file: f.insertedId,
        filename: file.filename,
        version: 1,
        created_at: new Date(),
        size: file.size,
      })

      const revision = await revisionsCollection.findOne({ _id: revisonId })
      const insertedFile = await filesCollection.findOne({ _id: f.insertedId })

      results.push({ file: insertedFile, revision})
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

      const { insertedId: revisionId } = await revisionsCollection.insertOne({
        file: f._id,
        filename: file.filename,
        version: previousRevision.version + 1,
        created_at: new Date(),
        size: file.size,
      })

      const revision = await revisionsCollection.findOne({ _id: revisionId })
      const insertedFile = await filesCollection.findOne({ _id: f._id })

      results.push({ file: insertedFile, revision })
    }
  }

  res.status(201).json(results)
})

app.get('/files/:id', async (req, res) => {
  const file = await db
    .collection('files')
    .findOne({ _id: mongodb.ObjectId.createFromHexString(req.params['id']) })

  const revisions = await db
    .collection('revisions')
    .find({ file: file._id })
    .toArray()

  res.json({ file, revisions })
})

app.get('/folders', async (req, res) => {
  const aggregate = await db
    .collection('files')
    .aggregate([{ $group: { _id: '$folder' } }])
    .toArray()

  res.json(aggregate.map((f) => ({ name: f._id })))
})

app.get('/_/:folder/:fn', async (req, res) => {
  const filename = req.params['fn']
  const revision = req.query['revision']
  const folder = req.params['folder']

  const file = await db.collection('files').findOne({ folder, name: filename })

  if (!file) {
    res.sendStatus(404)
    return
  }

  const revisionQuery = { file: file._id }
  if (revision) {
    revisionQuery['version'] = Number(revision)
  }

  const [rev] = await db
    .collection('revisions')
    .find(revisionQuery)
    .sort({ version: -1 })
    .limit(1)
    .toArray()

  if (!rev) {
    res.sendStatus(404)
    return
  }

  res.sendFile(rev.filename, {
    root: path.join(__dirname, 'socdn_files'),
    headers: { 'Content-Disposition': 'attachment; file="' + file.name + '"' },
  })
})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('App serving at http://localhost:' + port)
})

function checkForFolderName(req, res) {
  const folder = req.query['folder']

  if (!folder) {
    res.status(400).json({ detail: 'specify folder query parameter' })
    return false
  }

  return folder
}
