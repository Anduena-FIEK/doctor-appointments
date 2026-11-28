import mongoose from 'mongoose'

const historySchema = new mongoose.Schema(
  {
    version: Number,
    type: String,
    date: String,
    time: String,
    changedAt: { type: Date, default: Date.now },
  },
  { _id: false }
)

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    type: { type: String, enum: ['visit', 'checkup', 'analysis', 'procedure'], required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    version: { type: Number, default: 1 },
    history: [historySchema],
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
)

appointmentSchema.index(
  { doctor: 1, date: 1, time: 1 },
  { unique: true, partialFilterExpression: { archived: false } }
)

export default mongoose.model('Appointment', appointmentSchema)
