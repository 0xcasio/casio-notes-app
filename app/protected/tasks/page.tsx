import { Suspense } from "react";
import TaskList from "./components/TaskList";
import TasksPageSkeleton from "./components/TasksPageSkeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Personal Tasks | Team Task Manager",
  description: "View and manage your personal tasks",
};

export default function TasksPage() {
  return (
    <div className="max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Button asChild>
          <Link href="/protected/tasks/new">Create Task</Link>
        </Button>
      </div>
      <Suspense fallback={<TasksPageSkeleton />}>
        <TaskList />
      </Suspense>
    </div>
  );
} 