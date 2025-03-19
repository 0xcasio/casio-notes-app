import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { Task, TaskStatus, TaskPriority } from "@/types";
import TaskStatusBadge from "../components/TaskStatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: {
  params: { id: string }
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data: task } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", params.id)
    .single();

  return {
    title: task ? `${task.title} | Team Task Manager` : "Task Details",
    description: task?.description || "View task details",
  };
}

export default async function TaskDetailPage({ params }: {
  params: { id: string }
}) {
  const supabase = await createClient();
  
  const { data: taskData, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", params.id)
    .single();
    
  if (error || !taskData) {
    notFound();
  }
  
  // Ensure all required fields have values even if missing in database
  const task: Task = {
    ...taskData,
    status: taskData.status as TaskStatus || TaskStatus.TODO,
    priority: taskData.priority as TaskPriority || TaskPriority.MEDIUM,
    due_date: taskData.due_date || null
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/protected/tasks">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tasks
          </Link>
        </Button>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <Button asChild>
            <Link href={`/protected/tasks/${params.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Task
            </Link>
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Task Details</CardTitle>
            <div className="flex gap-2">
              {task.status && (
                <TaskStatusBadge status={task.status as TaskStatus} />
              )}
              {task.priority && (
                <Badge className={`
                  ${task.priority === TaskPriority.LOW ? 'bg-blue-100 text-blue-800' : ''}
                  ${task.priority === TaskPriority.MEDIUM ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${task.priority === TaskPriority.HIGH ? 'bg-red-100 text-red-800' : ''}
                `}>
                  {task.priority}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1">{task.description || "No description provided"}</p>
          </div>
          
          {task.due_date && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Due Date</h3>
              <p className="mt-1">{new Date(task.due_date).toLocaleDateString()}</p>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created</h3>
              <p className="mt-1">{new Date(task.created_at).toLocaleString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
              <p className="mt-1">{new Date(task.updated_at).toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 