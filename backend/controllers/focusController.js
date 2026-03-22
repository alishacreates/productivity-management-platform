const FocusSession = require('../models/FocusSession');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all focus sessions
// @route   GET /api/focus
const getSessions = asyncHandler(async (req, res) => {
  const sessions = await FocusSession.find().sort({ createdAt: -1 }).limit(50);

  // Calculate total focus time today
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todaySessions = await FocusSession.find({
    createdAt: { $gte: todayStart },
    type: 'focus',
    completed: true,
  });

  const totalTodayMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0);

  res.json({
    success: true,
    count: sessions.length,
    totalTodayMinutes,
    data: sessions,
  });
});

// @desc    Save a completed focus session
// @route   POST /api/focus
const createSession = asyncHandler(async (req, res) => {
  const session = await FocusSession.create(req.body);
  res.status(201).json({ success: true, data: session });
});

// @desc    Delete a session
// @route   DELETE /api/focus/:id
const deleteSession = asyncHandler(async (req, res) => {
  const session = await FocusSession.findByIdAndDelete(req.params.id);
  if (!session) {
    res.status(404);
    throw new Error('Session not found');
  }
  res.json({ success: true, message: 'Session deleted' });
});

// @desc    Get focus stats (weekly)
// @route   GET /api/focus/stats
const getFocusStats = asyncHandler(async (req, res) => {
  const days = 7;
  const stats = [];

  for (let i = days - 1; i >= 0; i--) {
    const dayStart = new Date();
    dayStart.setDate(dayStart.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    const sessions = await FocusSession.find({
      createdAt: { $gte: dayStart, $lte: dayEnd },
      type: 'focus',
      completed: true,
    });

    const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
    stats.push({
      date: dayStart.toISOString().split('T')[0],
      minutes: totalMinutes,
      sessions: sessions.length,
    });
  }

  res.json({ success: true, data: stats });
});

module.exports = { getSessions, createSession, deleteSession, getFocusStats };
