const { sendLLMRequest } = require('./llmService');

class SummaryService {
  static async generateDailySummary(tasks, userId) {
    try {
      console.log(`Generating daily summary for user ${userId} with ${tasks.length} tasks`);
      
      const completedTasks = tasks.filter(task => task.completed);
      const totalTasks = tasks.length;
      const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

      // Prepare task data for the AI prompt
      const taskSummary = {
        total: totalTasks,
        completed: completedTasks.length,
        completionRate: completionRate,
        completedTaskTexts: completedTasks.map(task => task.text),
        allTaskTexts: tasks.map(task => ({
          text: task.text,
          completed: task.completed,
          createdAt: task.createdAt
        }))
      };

      // Create a detailed prompt for the AI
      const prompt = this.createSummaryPrompt(taskSummary);
      
      console.log('Sending request to OpenAI for daily summary generation');
      
      // Use GPT-4 Turbo (the model name for GPT-4 Turbo is "gpt-4-turbo-preview" or "gpt-4-1106-preview")
      const summary = await sendLLMRequest('openai', 'gpt-4-turbo-preview', prompt);
      
      console.log('Successfully generated daily summary');
      return summary;
      
    } catch (error) {
      console.error(`Error generating daily summary for user ${userId}:`, error);
      throw new Error(`Failed to generate daily summary: ${error.message}`);
    }
  }

  static createSummaryPrompt(taskData) {
    const { total, completed, completionRate, completedTaskTexts, allTaskTexts } = taskData;
    
    let prompt = `You are a productivity coach providing a personalized daily summary. Please analyze the following task data and provide an encouraging, insightful summary of the user's day.

Task Statistics:
- Total tasks: ${total}
- Completed tasks: ${completed}
- Completion rate: ${completionRate}%

`;

    if (completed > 0) {
      prompt += `Completed tasks:
${completedTaskTexts.map((task, index) => `${index + 1}. ${task}`).join('\n')}

`;
    }

    if (total > completed) {
      const incompleteTasks = allTaskTexts.filter(task => !task.completed);
      prompt += `Remaining tasks:
${incompleteTasks.map((task, index) => `${index + 1}. ${task.text}`).join('\n')}

`;
    }

    prompt += `Please provide a personalized, encouraging summary that:
1. Acknowledges their accomplishments (if any)
2. Provides insights about their productivity patterns
3. Offers constructive feedback and suggestions for improvement
4. Maintains a positive, motivational tone
5. Keeps the response concise but meaningful (2-4 sentences)

Focus on being specific about their actual tasks and achievements rather than generic advice.`;

    return prompt;
  }
}

module.exports = SummaryService;