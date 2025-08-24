import mongoose from 'mongoose'

const namazSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fajr: { type: Boolean, default: false },
  zuhr: { type: Boolean, default: false },
  asar: { type: Boolean, default: false },
  maghrib: { type: Boolean, default: false },
  isha: { type: Boolean, default: false },
  date: {
    type: String,
    required: true,
  },
}, { timestamps: true })

// ✅ Compound index: one entry per user per date
namazSchema.index({ user: 1, date: 1 }, { unique: true })

const Namaz = mongoose.model('Namaz', namazSchema)

export default Namaz
