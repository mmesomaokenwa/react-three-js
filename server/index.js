import express from 'express'
import cors from 'cors'
import * as dotenv from 'dotenv'
import dalleRoutes from './routes/dalle.routes.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '50mb' }))
// Routes
app.use('/api/v1/dalle', dalleRoutes)

app.get('/', (req, res) => {
  res.send('Hello!')
})

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`)
})