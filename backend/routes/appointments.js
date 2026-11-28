import express from 'express'
import mongoose from 'mongoose'
import Appointment from '../models/Appointment.js'
import Doctor from '../models/Doctor.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()
router.use(requireAuth)

const TYPES = ['visit', 'checkup', 'analysis', 'procedure']
const dateRegex = /^\d{4}-\d{2}-\d{2}$/

function buildSlots(start, end) {
  const toMin = (t) => {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }
  const slots = []
  for (let m = toMin(start); m < toMin(end); m += 30) {
    slots.push(String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0'))
  }
  return slots
}

function checkDate(doctor, date) {
  if (typeof date !== 'string' || !dateRegex.test(date) || Number.isNaN(Date.parse(date))) {
    return 'Data nuk është e vlefshme.'
  }
  if (date < new Date().toISOString().slice(0, 10)) {
    return 'Data nuk mund të jetë në të kaluarën.'
  }
  const day = new Date(date + 'T00:00:00Z').getUTCDay()
  if (!doctor.workDays.includes(day)) {
    return 'Doktori nuk punon atë ditë.'
  }
  return null
}

function checkSlot(doctor, date, time) {
  const dateError = checkDate(doctor, date)
  if (dateError) return dateError
  if (typeof time !== 'string' || !buildSlots(doctor.startTime, doctor.endTime).includes(time)) {
    return 'Ora nuk është e vlefshme.'
  }
  return null
}

router.get('/slots', async (req, res) => {
  try {
    const { doctor, date } = req.query
    if (typeof doctor !== 'string' || !mongoose.isValidObjectId(doctor) || typeof date !== 'string') {
      return res.status(400).json({ message: 'Të dhëna të pavlefshme.' })
    }
    const doc = await Doctor.findOne({ _id: doctor, archived: false })
    if (!doc) return res.status(404).json({ message: 'Doktori nuk u gjet.' })

    if (checkDate(doc, date)) return res.json({ slots: [] })

    const taken = await Appointment.find({ doctor: doc._id, date, archived: false }).select('time')
    const takenTimes = taken.map((a) => a.time)
    const slots = buildSlots(doc.startTime, doc.endTime).filter((t) => !takenTimes.includes(t))
    res.json({ slots })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Gabim në server.' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { doctor, type, date, time } = req.body
    if (typeof doctor !== 'string' || !mongoose.isValidObjectId(doctor) || !TYPES.includes(type)) {
      return res.status(400).json({ message: 'Të dhëna të pavlefshme.' })
    }
    const doc = await Doctor.findOne({ _id: doctor, archived: false })
    if (!doc) return res.status(404).json({ message: 'Doktori nuk u gjet.' })

    const error = checkSlot(doc, date, time)
    if (error) return res.status(400).json({ message: error })

    const appointment = await Appointment.create({
      user: req.user.id,
      doctor: doc._id,
      type,
      date,
      time,
    })
    res.status(201).json(appointment)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Ky orar është i zënë.' })
    }
    console.error(err)
    res.status(500).json({ message: 'Gabim në server.' })
  }
})

router.get('/', async (req, res) => {
  try {
    const list = await Appointment.find({ user: req.user.id })
      .populate('doctor', 'name specialty location city')
      .sort({ date: -1, time: -1 })
    res.json(list)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Gabim në server.' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Të dhëna të pavlefshme.' })
    }
    const { date, time } = req.body
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user.id,
      archived: false,
    })
    if (!appointment) return res.status(404).json({ message: 'Termini nuk u gjet.' })

    const doc = await Doctor.findById(appointment.doctor)
    const error = checkSlot(doc, date, time)
    if (error) return res.status(400).json({ message: error })

    appointment.history.push({
      version: appointment.version,
      type: appointment.type,
      date: appointment.date,
      time: appointment.time,
    })
    appointment.date = date
    appointment.time = time
    appointment.version += 1
    await appointment.save()
    res.json(appointment)
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Ky orar është i zënë.' })
    }
    console.error(err)
    res.status(500).json({ message: 'Gabim në server.' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Të dhëna të pavlefshme.' })
    }
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user.id,
      archived: false,
    })
    if (!appointment) return res.status(404).json({ message: 'Termini nuk u gjet.' })

    appointment.archived = true
    await appointment.save()
    res.json({ message: 'Termini u anulua.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Gabim në server.' })
  }
})

export default router