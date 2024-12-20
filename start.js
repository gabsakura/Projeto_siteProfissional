import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import compression from 'compression'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

app.use(compression())
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.type('application/javascript')
  } else if (req.url.endsWith('.css')) {
    res.type('text/css')
  }
  next()
})

app.use(express.static('.', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript')
    } else if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css')
    }
  }
}))

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'), {
    headers: {
      'Content-Type': 'text/html'
    }
  })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Algo deu errado!')
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`)
}) 