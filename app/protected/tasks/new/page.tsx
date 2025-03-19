import TaskForm from "../components/TaskForm";

export const metadata = {
  title: "Create New Task | Team Task Manager",
  description: "Create a new task",
};

export default function NewTaskPage() {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
      <TaskForm />
    </div>
  );
} 