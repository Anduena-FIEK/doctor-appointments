import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Doctor from './models/Doctor.js'

dotenv.config()

const doctors = [
  { name: 'Dr. John Smith', specialty: 'Kardiolog', city: 'Prishtinë', location: 'Qendra Kardiologjike Prishtina', workDays: [1, 3, 5], startTime: '09:00', endTime: '15:00' },
  { name: 'Dr. Emily Brown', specialty: 'Pediatër', city: 'Prizren', location: 'Klinika Pediatrike Prizren', workDays: [2, 4], startTime: '08:00', endTime: '14:00' },
  { name: 'Dr. Michael Johnson', specialty: 'Dermatolog', city: 'Prishtinë', location: 'Klinika Dermatologjike Prishtina', workDays: [1, 2, 3, 4, 5], startTime: '10:00', endTime: '16:00' },
  { name: 'Dr. Sarah Wilson', specialty: 'Mjek i përgjithshëm', city: 'Pejë', location: 'Shtëpia e Shëndetit Pejë', workDays: [1, 2, 3, 4, 5], startTime: '08:00', endTime: '15:00' },
]

try {
  await mongoose.connect(process.env.MONGO_URI)
  const count = await Doctor.countDocuments()
  if (count > 0) {
    console.log('Doktorët ekzistojnë tashmë, nuk shtova asgjë.')
  } else {
    await Doctor.insertMany(doctors)
    console.log(`U shtuan ${doctors.length} doktorë.`)
  }
} catch (err) {
  console.error('Gabim:', err.message)
} finally {
  await mongoose.disconnect()
}