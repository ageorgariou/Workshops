import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { addTask } from '@/api/tasks';
import { useToast } from '@/hooks/useToast';

const taskSchema = z.object({
  text: z.string().min(1, 'Task cannot be empty').max(500, 'Task is too long'),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskInputProps {
  onTaskAdded: (task: any) => void;
}

export function TaskInput({ onTaskAdded }: TaskInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      setIsSubmitting(true);
      console.log('Adding new task:', data.text);
      
      const response = await addTask({ text: data.text });
      onTaskAdded(response.task);
      
      form.reset();
      toast({
        title: "Success",
        description: "Task added successfully!",
      });
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-3">
                      <Input
                        placeholder="What do you need to do today?"
                        className="flex-1 h-12 text-lg bg-white/50 dark:bg-gray-700/50 border-2 border-indigo-200 dark:border-indigo-700 focus:border-indigo-500 rounded-xl transition-all duration-200"
                        {...field}
                        disabled={isSubmitting}
                      />
                      <Button
                        type="submit"
                        disabled={isSubmitting || !field.value.trim()}
                        className="h-12 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <>
                            <Plus className="h-5 w-5 mr-2" />
                            Add Task
                          </>
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}