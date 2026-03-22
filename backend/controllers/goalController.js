const Goal = require('../models/Goal');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all goals
// @route   GET /api/goals
const getGoals = asyncHandler(async (req, res) => {
  const goals = await Goal.find().sort({ createdAt: -1 });
  res.json({ success: true, count: goals.length, data: goals });
});

// @desc    Get single goal
// @route   GET /api/goals/:id
const getGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findById(req.params.id);
  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }
  res.json({ success: true, data: goal });
});

// @desc    Create goal
// @route   POST /api/goals
const createGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.create(req.body);
  res.status(201).json({ success: true, data: goal });
});

// @desc    Update goal
// @route   PUT /api/goals/:id
const updateGoal = asyncHandler(async (req, res) => {
  // Auto-complete if progress hits 100
  if (req.body.progress === 100) req.body.status = 'completed';

  const goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }
  res.json({ success: true, data: goal });
});

// @desc    Delete goal
// @route   DELETE /api/goals/:id
const deleteGoal = asyncHandler(async (req, res) => {
  const goal = await Goal.findByIdAndDelete(req.params.id);
  if (!goal) {
    res.status(404);
    throw new Error('Goal not found');
  }
  res.json({ success: true, message: 'Goal deleted successfully' });
});

module.exports = { getGoals, getGoal, createGoal, updateGoal, deleteGoal };
