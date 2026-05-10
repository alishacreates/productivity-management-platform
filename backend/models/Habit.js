import mongoose from "mongoose";

const habitSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Habit name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
    },
    // Array of dates when habit was completed
    completedDates: {
      type: [Date],
      default: [],
    },
    streak: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: '#6366f1',
    },
  },
  { timestamps: true }
);

// Calculate streak before saving
habitSchema.pre('save', function (next) {
  if (this.completedDates.length === 0) {
    this.streak = 0;
    return next();
  }

  // Sort dates descending
  const sorted = [...this.completedDates]
    .map((d) => new Date(d).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i) // unique dates
    .sort((a, b) => new Date(b) - new Date(a));

  let streak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // Streak only counts if completed today or yesterday
  if (sorted[0] !== today && sorted[0] !== yesterday) {
    this.streak = 0;
    return next();
  }

  let current = new Date(sorted[0]);
  streak = 1;

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(current);
    prev.setDate(prev.getDate() - 1);
    if (new Date(sorted[i]).toDateString() === prev.toDateString()) {
      streak++;
      current = new Date(sorted[i]);
    } else {
      break;
    }
  }

  this.streak = streak;
  next();
});

module.exports = mongoose.model('Habit', habitSchema);
