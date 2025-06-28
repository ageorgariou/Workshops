const express = require('express');
const TaskService = require('../services/taskService.js');
const { requireUser } = require('./middleware/auth.js');

const router = express.Router();

// All task routes require authentication
router.use(requireUser);

// GET /api/tasks - Get all tasks for the current user
router.get('/', async (req, res) => {
  try {
    console.log(`Getting tasks for user: ${req.user._id}`);
    const tasks = await TaskService.list(req.user._id);
    res.json({ tasks });
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ message: error.message });
  }
});

// POST /api/tasks - Create a new task
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ message: 'Task text is required' });
    }

    if (text.length > 500) {
      return res.status(400).json({ message: 'Task text is too long (max 500 characters)' });
    }

    console.log(`Creating task for user ${req.user._id}:`, text);
    const task = await TaskService.create({ text: text.trim() }, req.user._id);
    res.status(201).json({ task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/tasks/:id - Update a task
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};

    if (req.body.hasOwnProperty('completed')) {
      updateData.completed = Boolean(req.body.completed);
    }

    if (req.body.text !== undefined) {
      if (!req.body.text || req.body.text.trim().length === 0) {
        return res.status(400).json({ message: 'Task text cannot be empty' });
      }
      if (req.body.text.length > 500) {
        return res.status(400).json({ message: 'Task text is too long (max 500 characters)' });
      }
      updateData.text = req.body.text.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }

    console.log(`Updating task ${id} for user ${req.user._id}:`, updateData);
    const task = await TaskService.update(id, updateData, req.user._id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Error updating task:', error);
    if (error.message === 'Task not found') {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
});

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`Deleting task ${id} for user: ${req.user._id}`);
    const deleted = await TaskService.delete(id, req.user._id);
    
    if (!deleted) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;