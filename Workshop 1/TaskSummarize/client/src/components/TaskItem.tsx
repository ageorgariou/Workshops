import React, { useState } from 'react';
import { Trash2, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { updateTask, deleteTask } from '@/api/tasks';
import { useToast } from '@/hooks/useToast';
import { cn } from '@/lib/utils';

interface Task {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface TaskItemProps {
  task: Task;
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (taskId: string) => void;
}

export function TaskItem({ task, onTaskUpdated, onTaskDeleted }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleToggleComplete = async () => {
    try {
      setIsUpdating(true);
      console.log('Toggling task completion:', task._id, !task.completed);
      
      const response = await updateTask(task._id, { completed: !task.completed });
      onTaskUpdated(response.task);
      
      toast({
        title: "Success",
        description: task.completed ? "Task marked as incomplete" : "Task completed!",
      });
    } catch (error: any) {
      console.error('Error updating task:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      console.log('Deleting task:', task._id);
      
      await deleteTask(task._id);
      onTaskDeleted(task._id);
      
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className={cn(
      "flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md",
      task.completed 
        ? "bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800" 
        : "bg-white/50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-600"
    )}>
      <div className="flex items-center gap-3 flex-1">
        <div className="relative">
          {isUpdating ? (
            <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
          ) : (
            <Checkbox
              checked={task.completed}
              onCheckedChange={handleToggleComplete}
              className="h-5 w-5 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
            />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-medium transition-all duration-200",
            task.completed 
              ? "line-through text-muted-foreground" 
              : "text-foreground"
          )}>
            {task.text}
          </p>
          <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{formatDate(task.createdAt)}</span>
          </div>
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}