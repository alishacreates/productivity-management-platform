const express = require('express');
const router = express.Router();
const {
  getSessions,
  createSession,
  deleteSession,
  getFocusStats,
} = require('../controllers/focusController');

router.route('/').get(getSessions).post(createSession);
router.get('/stats', getFocusStats);
router.delete('/:id', deleteSession);

module.exports = router;
