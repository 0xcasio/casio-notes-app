import TaskForm from "../../components/TaskForm";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { TaskFormValues, TaskStatus, TaskPriority } from "@/types";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

// Define params type exactly as Next.js expects
type PageParams = {
  id: string;
};

// Generate metadata with correct param typing
export async function generateMetadata({ 
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data: task } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", params.id)
    .single();

  return {
    title: task ? `Edit ${task.title} | Team Task Manager` : "Edit Task",
    description: "Edit your task details",
  };
}

// Page component with correct param typing
export default async function EditTaskPage({ 
  params,
}: {
  params: PageParams;
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
  
  // Convert the task data to the form values format
  // Ensure all required fields have values even if missing in database
  const initialData: TaskFormValues = {
    title: taskData.title,
    description: taskData.description || '',
    status: (taskData.status as TaskStatus) || TaskStatus.TODO,
    priority: (taskData.priority as TaskPriority) || TaskPriority.MEDIUM,
    due_date: taskData.due_date ? new Date(taskData.due_date) : null,
    team_id: taskData.team_id,
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Task</h1>
      <TaskForm taskId={params.id} initialData={initialData} />
    </div>
  );
} 