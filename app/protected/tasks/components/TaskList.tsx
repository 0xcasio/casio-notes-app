'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Task, TaskStatus, TaskPriority } from '@/types';
import TaskStatusBadge from './TaskStatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<keyof Task>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        
        let query = supabase
          .from('tasks')
          .select('*');
        
        // Apply status filter
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        
        // Apply priority filter
        if (priorityFilter !== 'all') {
          query = query.eq('priority', priorityFilter);
        }
        
        // Apply sorting
        query = query.order(sortField, { ascending: sortDirection === 'asc' });
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        setTasks(data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchTasks();
  }, [sortField, sortDirection, statusFilter, priorityFilter]);

  function handleSort(field: keyof Task) {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading your tasks...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">You don't have any tasks yet.</p>
        <p className="mt-2 text-gray-400">Create a new task to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select 
            className="p-2 border rounded-md bg-background"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
          >
            <option value="all">All Status</option>
            <option value={TaskStatus.TODO}>Not Started</option>
            <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
            <option value={TaskStatus.COMPLETED}>Completed</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select 
            className="p-2 border rounded-md bg-background"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
          >
            <option value="all">All Priorities</option>
            <option value={TaskPriority.LOW}>Low</option>
            <option value={TaskPriority.MEDIUM}>Medium</option>
            <option value={TaskPriority.HIGH}>High</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Sort By</label>
          <select 
            className="p-2 border rounded-md bg-background"
            value={sortField}
            onChange={(e) => handleSort(e.target.value as keyof Task)}
          >
            <option value="created_at">Created Date</option>
            <option value="updated_at">Last Updated</option>
            <option value="due_date">Due Date</option>
            <option value="title">Title</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Direction</label>
          <select 
            className="p-2 border rounded-md bg-background"
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{task.title}</CardTitle>
                <div className="flex gap-2">
                  <TaskStatusBadge status={task.status as TaskStatus} />
                  <Badge className={`
                    ${task.priority === TaskPriority.LOW ? 'bg-blue-100 text-blue-800' : ''}
                    ${task.priority === TaskPriority.MEDIUM ? 'bg-yellow-100 text-yellow-800' : ''}
                    ${task.priority === TaskPriority.HIGH ? 'bg-red-100 text-red-800' : ''}
                  `}>
                    {task.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">
                {task.description || 'No description provided'}
              </p>
              {task.due_date && (
                <p className="text-xs text-gray-400 mt-2">
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 