const express = require('express');
const router = express.Router();
const {
  getHabits,
  getHabit,
  createHabit,
  updateHabit,
  deleteHabit,
  markHabitComplete,
} = require('../controllers/habitController');

router.route('/').get(getHabits).post(createHabit);
router.route('/:id').get(getHabit).put(updateHabit).delete(deleteHabit);
router.patch('/:id/complete', markHabitComplete);

module.exports = router;
