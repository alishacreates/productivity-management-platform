const Habit = require('../models/Habit');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all habits
// @route   GET /api/habits
const getHabits = asyncHandler(async (req, res) => {
  const habits = await Habit.find().sort({ createdAt: -1 });
  res.json({ success: true, count: habits.length, data: habits });
});

// @desc    Get single habit
// @route   GET /api/habits/:id
const getHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);
  if (!habit) {
    res.status(404);
    throw new Error('Habit not found');
  }
  res.json({ success: true, data: habit });
});

// @desc    Create habit
// @route   POST /api/habits
const createHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.create(req.body);
  res.status(201).json({ success: true, data: habit });
});

// @desc    Update habit
// @route   PUT /api/habits/:id
const updateHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!habit) {
    res.status(404);
    throw new Error('Habit not found');
  }
  res.json({ success: true, data: habit });
});

// @desc    Delete habit
// @route   DELETE /api/habits/:id
const deleteHabit = asyncHandler(async (req, res) => {
  const habit = await Habit.findByIdAndDelete(req.params.id);
  if (!habit) {
    res.status(404);
    throw new Error('Habit not found');
  }
  res.json({ success: true, message: 'Habit deleted successfully' });
});

// @desc    Mark habit as done for today
// @route   PATCH /api/habits/:id/complete
const markHabitComplete = asyncHandler(async (req, res) => {
  const habit = await Habit.findById(req.params.id);
  if (!habit) {
    res.status(404);
    throw new Error('Habit not found');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if already completed today
  const alreadyDone = habit.completedDates.some(
    (d) => new Date(d).toDateString() === today.toDateString()
  );

  if (alreadyDone) {
    // Unmark — remove today's date
    habit.completedDates = habit.completedDates.filter(
      (d) => new Date(d).toDateString() !== today.toDateString()
    );
  } else {
    habit.completedDates.push(today);
  }

  await habit.save(); // streak recalculated in pre-save hook
  res.json({ success: true, data: habit, toggled: !alreadyDone });
});

module.exports = { getHabits, getHabit, createHabit, updateHabit, deleteHabit, markHabitComplete };
