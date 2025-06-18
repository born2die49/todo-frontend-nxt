// app/(auth)/tasks/[id]/page.tsx
import serverApi from "@/app/lib/serverApi";
import { Task } from "@/app/lib/definitions";

// The params object will have the 'id' from the URL
export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  let task: Task | null = null;

  try {
    const response = await serverApi(`/api/tasks/${id}/`);
    if (response.ok) {
      task = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch task details:", error);
  }

  if (!task) {
    return <div>Task not found or you're not allowed to see it!</div>;
  }

  // Now, build some beautiful JSX to display the task details.
  // Think about showing the name, description, due date, status, etc.
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">{task.task_name}</h1>
      <p className="text-gray-600 mt-2">{task.description}</p>
      <p className="text-gray-600 mt-2">{task.due_date}</p>
    </main>
  );
}