import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import doctorRoutes from './routes/doctors.js'
import appointmentRoutes from './routes/appointments.js'

dotenv.config()

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/auth', authRoutes)
app.use('/api/doctors', doctorRoutes)
app.use('/api/appointments', appointmentRoutes)

const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB u lidh')
    app.listen(PORT, () => console.log(`Serveri punon në portin ${PORT}`))
  })
  .catch((err) => {
    console.error('Gabim në lidhjen me MongoDB:', err.message)
  })
  