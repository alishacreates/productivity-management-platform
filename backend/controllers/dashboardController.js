const Task = require('../models/Task');
const Habit = require('../models/Habit');
const FocusSession = require('../models/FocusSession');
const Goal = require('../models/Goal');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get dashboard overview stats
// @route   GET /api/dashboard
const getDashboardStats = asyncHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  // Tasks completed today
  const tasksCompletedToday = await Task.countDocuments({
    status: 'completed',
    updatedAt: { $gte: todayStart },
  });

  // Pending tasks
  const pendingTasks = await Task.countDocuments({ status: 'pending' });

  // Total tasks
  const totalTasks = await Task.countDocuments();

  // Best habit streak
  const habits = await Habit.find();
  const maxStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);

  // Focus time today (in minutes)
  const focusSessions = await FocusSession.find({
    createdAt: { $gte: todayStart },
    type: 'focus',
    completed: true,
  });
  const focusMinutesToday = focusSessions.reduce((acc, s) => acc + s.duration, 0);

  // Active goals
  const activeGoals = await Goal.countDocuments({ status: 'active' });
  const completedGoals = await Goal.countDocuments({ status: 'completed' });

  // Recent tasks (last 5)
  const recentTasks = await Task.find().sort({ createdAt: -1 }).limit(5);

  // Habits with today's completion status
  const habitsWithStatus = habits.map((habit) => ({
    _id: habit._id,
    name: habit.name,
    streak: habit.streak,
    color: habit.color,
    completedToday: habit.completedDates.some(
      (d) => new Date(d).toDateString() === new Date().toDateString()
    ),
  }));

  res.json({
    success: true,
    data: {
      tasks: {
        completedToday: tasksCompletedToday,
        pending: pendingTasks,
        total: totalTasks,
      },
      habits: {
        maxStreak,
        total: habits.length,
        list: habitsWithStatus,
      },
      focus: {
        minutesToday: focusMinutesToday,
        hoursToday: (focusMinutesToday / 60).toFixed(1),
        sessionsToday: focusSessions.length,
      },
      goals: {
        active: activeGoals,
        completed: completedGoals,
      },
      recentTasks,
    },
  });
});

module.exports = { getDashboardStats };
