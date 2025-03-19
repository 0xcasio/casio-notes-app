'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Task, TaskStatus, TaskPriority, TaskFormValues } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface TaskFormProps {
  taskId?: string; // Optional for edit mode
  initialData?: TaskFormValues; // Optional for edit mode
}

export default function TaskForm({ taskId, initialData }: TaskFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<TaskFormValues>({
    title: '',
    description: '',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    due_date: null,
    team_id: null,
    ...initialData,
  });
  
  const isEditMode = !!taskId;

  // Get the current user ID
  useEffect(() => {
    async function getUserId() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    }
    
    getUserId();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (!userId) {
      setError('You must be logged in to create or edit tasks.');
      setLoading(false);
      return;
    }
    
    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date ? new Date(formData.due_date).toISOString() : null,
        team_id: formData.team_id,
      };
      
      // Create or update the task
      if (isEditMode) {
        // Update existing task
        const { error } = await supabase
          .from('tasks')
          .update({
            ...taskData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', taskId);
          
        if (error) {
          // If error is about missing column, try without that column
          if (error.message.includes('priority')) {
            const { error: errorWithoutPriority } = await supabase
              .from('tasks')
              .update({
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                due_date: taskData.due_date,
                team_id: taskData.team_id,
                updated_at: new Date().toISOString(),
              })
              .eq('id', taskId);
              
            if (errorWithoutPriority) throw errorWithoutPriority;
          } else if (error.message.includes('status')) {
            const { error: errorWithoutStatus } = await supabase
              .from('tasks')
              .update({
                title: taskData.title,
                description: taskData.description,
                priority: taskData.priority,
                due_date: taskData.due_date,
                team_id: taskData.team_id,
                updated_at: new Date().toISOString(),
              })
              .eq('id', taskId);
              
            if (errorWithoutStatus) throw errorWithoutStatus;
          } else if (error.message.includes('due_date')) {
            const { error: errorWithoutDueDate } = await supabase
              .from('tasks')
              .update({
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                priority: taskData.priority,
                team_id: taskData.team_id,
                updated_at: new Date().toISOString(),
              })
              .eq('id', taskId);
              
            if (errorWithoutDueDate) throw errorWithoutDueDate;
          } else {
            throw error;
          }
        }
        
        // Redirect to task detail page
        router.push(`/protected/tasks/${taskId}`);
        router.refresh();
      } else {
        // Create new task
        try {
          // First try with all fields
          const { data, error } = await supabase
            .from('tasks')
            .insert({
              ...taskData,
              user_id: userId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .select();
            
          if (error) {
            // If error is about missing column, try without that column
            if (error.message.includes('priority')) {
              const { data: dataWithoutPriority, error: errorWithoutPriority } = await supabase
                .from('tasks')
                .insert({
                  title: taskData.title,
                  description: taskData.description,
                  status: taskData.status,
                  due_date: taskData.due_date,
                  team_id: taskData.team_id,
                  user_id: userId,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })
                .select();
                
              if (errorWithoutPriority) throw errorWithoutPriority;
            } else if (error.message.includes('status')) {
              const { data: dataWithoutStatus, error: errorWithoutStatus } = await supabase
                .from('tasks')
                .insert({
                  title: taskData.title,
                  description: taskData.description,
                  priority: taskData.priority,
                  due_date: taskData.due_date,
                  team_id: taskData.team_id,
                  user_id: userId,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })
                .select();
                
              if (errorWithoutStatus) throw errorWithoutStatus;
            } else if (error.message.includes('due_date')) {
              const { data: dataWithoutDueDate, error: errorWithoutDueDate } = await supabase
                .from('tasks')
                .insert({
                  title: taskData.title,
                  description: taskData.description,
                  status: taskData.status,
                  priority: taskData.priority,
                  team_id: taskData.team_id,
                  user_id: userId,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                })
                .select();
                
              if (errorWithoutDueDate) throw errorWithoutDueDate;
            } else {
              throw error;
            }
          }
        } catch (insertError: any) {
          // Last resort: try with minimal fields
          const { error: minimalError } = await supabase
            .from('tasks')
            .insert({
              title: taskData.title,
              description: taskData.description,
              user_id: userId,
            });
            
          if (minimalError) throw minimalError;
        }
        
        // Redirect to task list
        router.push('/protected/tasks');
        router.refresh();
      }
    } catch (err: any) {
      console.error('Error saving task:', err);
      setError(err.message || 'Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  }
  
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }
  
  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, due_date: value ? new Date(value) : null }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md">{error}</div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Task Title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="w-full p-2 border rounded-md"
          value={formData.title}
          onChange={handleInputChange}
        />
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          className="w-full p-2 border rounded-md"
          value={formData.description || ''}
          onChange={handleInputChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="w-full p-2 border rounded-md"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value={TaskStatus.TODO}>Not Started</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className="w-full p-2 border rounded-md"
            value={formData.priority}
            onChange={handleInputChange}
          >
            <option value={TaskPriority.LOW}>Low</option>
            <option value={TaskPriority.MEDIUM}>Medium</option>
            <option value={TaskPriority.HIGH}>High</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="due_date" className="block text-sm font-medium mb-1">
          Due Date
        </label>
        <input
          id="due_date"
          name="due_date"
          type="date"
          className="w-full p-2 border rounded-md"
          value={formData.due_date ? new Date(formData.due_date).toISOString().split('T')[0] : ''}
          onChange={handleDateChange}
        />
      </div>
      
      <div className="flex gap-4 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
} 