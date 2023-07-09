import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())

app.use((req, res, next) => {
  // logger
  const t = Date.now()
  const path = req.url
  next()

  const time = Date.now() - t

  console.log(`${res.statusCode} ${req.method.padEnd(7, ' ')} ${path.padEnd(40, ' ')} ${time}ms`)
})

app.use('/admin', express.static('./admin'))

app.use('/files', (req, res) => {
  if (['PATCH', 'DELETE', 'PUT'].includes(req.method)) {
    res.status(405).json({ detail: 'method not allowed' })
    return
  }

  const folder = req.query['folder']

  if (!folder) {
    res.status(400).json({ detail: 'specify folder query parameter' })
    return
  }

  res.json(folder)
})

app.use('/files/:id', (req, res) => {

})

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log('App serving at http://localhost:' + port)
})
