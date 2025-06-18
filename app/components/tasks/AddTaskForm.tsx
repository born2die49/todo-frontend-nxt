'use client';

import { useState } from "react";
import { createTask } from "@/app/lib/tasks"; 
import { useRouter } from "next/navigation";

export function AddTaskForm() {
  const [taskName, setTaskName] = useState('');
  const [taskDueDate, setDueDate] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!taskName) {
      setError("Task name is required.");
      return;
    }

    try {
      const newTask = await createTask({
        task_name: taskName,
        due_date: taskDueDate,
        description: taskDescription,
      });
      console.log("Task created successfully:", newTask);

      setTaskName('');
      setDueDate('');
      setTaskDescription('');

      router.refresh();
    } catch (err: any) {
      console.error("Failed to create task", err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 border-gray-300 shadow-xl p-4 border rounded-md">
      <h2 className="text-xl font-semibold mb-4">Add a New Task</h2>

      <div className="mb-4">
        <label htmlFor="task_name" className="block mb-1">Task Name</label>
        <input
          type="text"
          id="task_name"
          className="w-full p-2 border rounded border-gray-400"
          value={taskName}
          onChange={e => setTaskName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="due_date" className="block mb-1">Due Date</label>
        <input
          type="date"
          id="task_name"
          className="w-full p-2 border rounded border-gray-400"
          value={taskDueDate}
          onChange={e => setDueDate(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block mb-1">Description</label>
        <textarea
          id="description"
          className="w-full p-2 border rounded border-gray-400"
          value={taskDescription}
          onChange={e => setTaskDescription(e.target.value)}
        />
      </div>

      <button 
        type="submit" 
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 hover:cursor-pointer"
        disabled={isLoading}  
      >
        {isLoading? 'Adding' : 'Add Task'}
      </button>
    </form>
  )
}