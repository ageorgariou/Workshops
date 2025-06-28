import React, { useState } from 'react';
import { Sparkles, Loader2, TrendingUp, Target, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateDailySummary } from '@/api/summary';
import { useToast } from '@/hooks/useToast';

interface Task {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface DailySummaryProps {
  tasks: Task[];
}

export function DailySummary({ tasks }: DailySummaryProps) {
  const [summary, setSummary] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateSummary = async () => {
    try {
      setIsGenerating(true);
      console.log('Generating daily summary for', tasks.length, 'tasks');
      
      const response = await generateDailySummary({ tasks });
      setSummary(response.summary);
      
      toast({
        title: "Success",
        description: "Daily summary generated successfully!",
      });
    } catch (error: any) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const completedTasks = tasks.filter(task => task.completed);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-600">
          <Sparkles className="h-5 w-5" />
          Daily Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <Target className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Completion Rate</p>
              <p className="text-xl font-bold text-blue-600">{completionRate}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-muted-foreground">Tasks Done</p>
              <p className="text-xl font-bold text-green-600">{completedTasks.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-muted-foreground">Total Tasks</p>
              <p className="text-xl font-bold text-purple-600">{tasks.length}</p>
            </div>
          </div>
        </div>

        {/* Generate Summary Button */}
        <div className="text-center">
          <Button
            onClick={handleGenerateSummary}
            disabled={isGenerating || tasks.length === 0}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Analyzing your day...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Daily Summary
              </>
            )}
          </Button>
          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Add some tasks to generate your daily summary
            </p>
          )}
        </div>

        {/* Summary Display */}
        {summary && (
          <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700">
            <h3 className="text-lg font-semibold mb-3 text-purple-700 dark:text-purple-300">
              Your Productivity Insights
            </h3>
            <div className="prose prose-sm max-w-none text-gray-700 dark:text-gray-300">
              {summary.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}