import api from './api';

// Description: Get all tasks for the current user
// Endpoint: GET /api/tasks
// Request: {}
// Response: { tasks: Array<{ _id: string, text: string, completed: boolean, createdAt: string }> }
export const getTasks = async () => {
  try {
    const response = await api.get('/api/tasks');
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Add a new task
// Endpoint: POST /api/tasks
// Request: { text: string }
// Response: { task: { _id: string, text: string, completed: boolean, createdAt: string } }
export const addTask = async (data: { text: string }) => {
  try {
    const response = await api.post('/api/tasks', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Update a task
// Endpoint: PUT /api/tasks/:id
// Request: { completed?: boolean, text?: string }
// Response: { task: { _id: string, text: string, completed: boolean, createdAt: string } }
export const updateTask = async (taskId: string, data: { completed?: boolean; text?: string }) => {
  try {
    const response = await api.put(`/api/tasks/${taskId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};

// Description: Delete a task
// Endpoint: DELETE /api/tasks/:id
// Request: {}
// Response: { success: boolean, message: string }
export const deleteTask = async (taskId: string) => {
  try {
    const response = await api.delete(`/api/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};