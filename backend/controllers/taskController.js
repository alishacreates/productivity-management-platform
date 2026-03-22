const Task = require('../models/Task');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, sort } = req.query;
  const filter = {};

  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  let query = Task.find(filter);

  if (sort === 'deadline') query = query.sort({ deadline: 1 });
  else if (sort === 'priority') query = query.sort({ priority: -1 });
  else query = query.sort({ createdAt: -1 });

  const tasks = await query;
  res.json({ success: true, count: tasks.length, data: tasks });
});

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Public
const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.json({ success: true, data: task });
});

// @desc    Create task
// @route   POST /api/tasks
// @access  Public
const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create(req.body);
  res.status(201).json({ success: true, data: task });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.json({ success: true, data: task });
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.json({ success: true, message: 'Task deleted successfully' });
});

// @desc    Toggle task status
// @route   PATCH /api/tasks/:id/toggle
// @access  Public
const toggleTaskStatus = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  task.status = task.status === 'pending' ? 'completed' : 'pending';
  await task.save();
  res.json({ success: true, data: task });
});

module.exports = { getTasks, getTask, createTask, updateTask, deleteTask, toggleTaskStatus };
