import { Suspense } from "react";
import TaskList from "@/app/components/tasks/TaskList";
import { TaskListSkeleton } from "@/app/components/tasks/TaskListSkeleton";

export default function TasksPage() {
  return (
    <Suspense fallback={<TaskListSkeleton/>}>
      <TaskList/>
    </Suspense>
  );
}