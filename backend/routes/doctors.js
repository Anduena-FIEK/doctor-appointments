import express from 'express'
import Doctor from '../models/Doctor.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

router.get('/', requireAuth, async (req, res) => {
  try {
    const filter = { archived: false }
    const { day, specialty, city } = req.query

    if (typeof day === 'string' && day !== '') {
      const d = Number(day)
      if (!Number.isInteger(d) || d < 0 || d > 6) {
        return res.status(400).json({ message: 'Dita nuk është e vlefshme.' })
      }
      filter.workDays = d
    }
    if (typeof specialty === 'string' && specialty) filter.specialty = specialty
    if (typeof city === 'string' && city) filter.city = city

    const doctors = await Doctor.find(filter).sort({ name: 1 })
    res.json(doctors)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Gabim në server.' })
  }
})

export default router