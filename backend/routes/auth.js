import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import rateLimit from 'express-rate-limit'
import User from '../models/User.js'

const router = express.Router()

router.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    message: { message: 'Shumë përpjekje. Provo përsëri pas pak.' },
  })
)

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

router.post('/register', async (req, res) => {
  try {
    const { name, email, city, password, consent } = req.body

    if ([name, email, city, password].some((v) => typeof v !== 'string')) {
      return res.status(400).json({ message: 'Të dhëna të pavlefshme.' })
    }
    if (!name.trim() || !city.trim() || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Plotëso saktë të gjitha fushat.' })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Fjalëkalimi duhet të ketë të paktën 8 karaktere.' })
    }
    if (consent !== true) {
      return res.status(400).json({ message: 'Duhet të pranosh përpunimin e të dhënave.' })
    }

    const exists = await User.findOne({ email: email.toLowerCase().trim() })
    if (exists) {
      return res.status(409).json({ message: 'Ky email është i regjistruar.' })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    await User.create({ name, email, city, passwordHash, consentAt: new Date() })

    res.status(201).json({ message: 'Llogaria u krijua me sukses.' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Gabim në server.' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Të dhëna të pavlefshme.' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim(), archived: false })
    const ok = user && (await bcrypt.compare(password, user.passwordHash))

    if (!ok) {
      return res.status(401).json({ message: 'Email ose fjalëkalim i gabuar.' })
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    })

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, city: user.city, role: user.role },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Gabim në server.' })
  }
})

export default router