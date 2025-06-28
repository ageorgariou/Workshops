import api from './api';

interface Task {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

// Description: Generate AI-powered daily summary based on user's tasks
// Endpoint: POST /api/summary/daily
// Request: { tasks: Array<{ _id: string, text: string, completed: boolean, createdAt: string }> }
// Response: { summary: string }
export const generateDailySummary = async (data: { tasks: Task[] }) => {
  try {
    const response = await api.post('/api/summary/daily', data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message || error.message);
  }
};