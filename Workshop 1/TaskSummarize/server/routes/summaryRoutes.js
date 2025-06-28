const express = require('express');
const SummaryService = require('../services/summaryService');
const { requireUser } = require('./middleware/auth');

const router = express.Router();

// All summary routes require authentication
router.use(requireUser);

// POST /api/summary/daily - Generate daily summary based on user's tasks
router.post('/daily', async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!tasks || !Array.isArray(tasks)) {
      return res.status(400).json({ message: 'Tasks array is required' });
    }

    console.log(`Generating daily summary for user ${req.user._id} with ${tasks.length} tasks`);

    // Validate task structure
    const validTasks = tasks.filter(task => 
      task && 
      typeof task.text === 'string' && 
      typeof task.completed === 'boolean'
    );

    if (validTasks.length !== tasks.length) {
      console.warn(`Some tasks had invalid structure. Using ${validTasks.length} out of ${tasks.length} tasks`);
    }

    const summary = await SummaryService.generateDailySummary(validTasks, req.user._id);

    res.json({ summary });
  } catch (error) {
    console.error('Error generating daily summary:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;