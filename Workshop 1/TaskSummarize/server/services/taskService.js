const Task = require('../models/Task.js');

class TaskService {
  static async list(userId) {
    try {
      console.log(`Fetching tasks for user: ${userId}`);
      return await Task.find({ userId }).sort({ createdAt: -1 });
    } catch (err) {
      console.error(`Database error while listing tasks for user ${userId}:`, err);
      throw new Error(`Database error while listing tasks: ${err.message}`);
    }
  }

  static async get(taskId, userId) {
    try {
      console.log(`Fetching task ${taskId} for user: ${userId}`);
      return await Task.findOne({ _id: taskId, userId });
    } catch (err) {
      console.error(`Database error while getting task ${taskId}:`, err);
      throw new Error(`Database error while getting task: ${err.message}`);
    }
  }

  static async create(taskData, userId) {
    try {
      console.log(`Creating task for user ${userId}:`, taskData.text);
      const task = new Task({
        ...taskData,
        userId
      });
      return await task.save();
    } catch (err) {
      console.error(`Database error while creating task for user ${userId}:`, err);
      throw new Error(`Database error while creating task: ${err.message}`);
    }
  }

  static async update(taskId, updateData, userId) {
    try {
      console.log(`Updating task ${taskId} for user ${userId}:`, updateData);
      const task = await Task.findOneAndUpdate(
        { _id: taskId, userId },
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      return task;
    } catch (err) {
      console.error(`Database error while updating task ${taskId}:`, err);
      throw new Error(`Database error while updating task: ${err.message}`);
    }
  }

  static async delete(taskId, userId) {
    try {
      console.log(`Deleting task ${taskId} for user: ${userId}`);
      const result = await Task.deleteOne({ _id: taskId, userId });
      return result.deletedCount === 1;
    } catch (err) {
      console.error(`Database error while deleting task ${taskId}:`, err);
      throw new Error(`Database error while deleting task: ${err.message}`);
    }
  }
}

module.exports = TaskService;