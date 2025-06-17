"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/app/lib/definitions";
import { deleteTask, updateTask } from "@/app/lib/tasks";

type TaskItemProps = {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ 
    task_name: task.task_name,
    due_date: task.due_date,
    description: task.description || '' 
  });

  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);

    if (!editData.task_name) {
      setError("Task name is required.");
      return;
    }

    try {
      await updateTask(task.id, editData);
      console.log("Task created successfully.");

      setIsEditing(false);
      router.refresh();
    } catch (err: any) {
      console.error("Failed to create task", err);
      setError(err.message || "An unknown error occurred.");
    }
  }

  const handleDelete = async() => {
    try {
      await deleteTask(task.id);
      console.log("Task deleted successfully.");

      router.refresh();
    } catch (err: any) {
      console.error("Failed to delete task", err);
      setError(err.message || "An unknown error occurred.");
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setEditData(prev => ({...prev, [name]: value}));
  };

  return (
    <li className="p-2 border border-gray-300 rounded-md shadow-md mb-2 hover:bg-gray-100 hover:scale-105 transition">
      {isEditing ? (

        <div className="space-y-3">

          <input
            type="text"
            name="task_name"
            value={editData.task_name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="date"
            name="due_date"
            value={editData.due_date!}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
          />

          <textarea
            name="description"
            value={editData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            rows={3}
          />

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex gap-2 justify-end">
            <button onClick={handleSave} className="bg-green-600 text-white px-4 py-1 rounded-md text-sm  hover:bg-green-700 hover:cursor-pointer">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-500 text-white px-4 py-1 rounded-md text-sm hover:bg-gray-600 hover:cursor-pointer">
              Cancel
            </button>
          </div>

        </div>
      ) : (
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-semibold">{task.task_name}</h2>
            <p className="text-sm text-gray-600">{task.description}</p>
            
            {task.due_date && (
              <p className="text-sm text-gray-900">
                Due: {new Date(task.due_date).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-xs font-medium bg-gray-200 text-gray-800 px-2 py-1 rounded-full">
              {task.status}
            </span>

            <div className="flex gap-2 mt-2">
              <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-amber-600 hover:cursor-pointer">
                Edit
              </button>
              <button onClick={() => handleDelete()} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 hover:cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
