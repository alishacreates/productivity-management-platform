import mongoose from "mongoose";

const focusSessionSchema = new mongoose.Schema(
  {
    duration: {
      type: Number, // in minutes
      required: [true, 'Session duration is required'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    type: {
      type: String,
      enum: ['focus', 'short_break', 'long_break'],
      default: 'focus',
    },
    completed: {
      type: Boolean,
      default: true,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FocusSession', focusSessionSchema);
