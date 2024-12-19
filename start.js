import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import compression from 'compression'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 10000

app.use(compression())
app.use(express.static('.'))

app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'))
})

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`)
}) 