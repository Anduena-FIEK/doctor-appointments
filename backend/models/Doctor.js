import mongoose from 'mongoose'

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    workDays: [{ type: Number, min: 0, max: 6 }],
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model('Doctor', doctorSchema)