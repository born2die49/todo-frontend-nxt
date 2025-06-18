"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Task } from "@/app/lib/definitions";
import { deleteTask, updateTask } from "@/app/lib/tasks";
import Link from "next/link";
import ConfirmationModal from "../ui/ConfirmationModal";

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
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: 'pending' | 'in_progress' | 'completed') => {
        setIsStatusDropdownOpen(false); // Close dropdown immediately
        if (task.status === newStatus) return; // Don't update if status is the same

        try {
            await updateTask(task.id, { status: newStatus });
            router.refresh();
        } catch (err) {
            setError("Failed to update status.");
        }
    };

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

  const handleMarkComplete = async() => {
    try {
      await updateTask(task.id, { status: 'completed' });
      console.log("Task Marked completed.");

      router.refresh();
    } catch (err: any) {
      console.error("Failed to mark as complete", err);
      setError(err.message || "An unknown error occurred.");
    }
  }

  const handleDelete = async() => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      console.log("Task deleted successfully.");

      router.refresh();
    } catch (err: any) {
      console.error("Failed to delete task", err);
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setEditData(prev => ({...prev, [name]: value}));
  };

  return (
    <li className={`p-2 border border-gray-300 rounded-md shadow-md mb-2 ${task.status === 'completed' ? 'line-through opacity-60' : ''} hover:bg-gray-100 transition`}>
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
          <Link href={`/tasks/${task.id}`}>
            <div>
              <h2 className="font-semibold">{task.task_name}</h2>
              <p className="text-sm text-gray-600">{task.description}</p>
              
              {task.due_date && (
                <p className="text-sm text-gray-900">
                  Due: {new Date(task.due_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </Link>

          <div className="flex flex-col items-end gap-2">

            <div className="relative">
              <button
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="text-xs font-medium bg-gray-200 text-gray-800 px-2 py-1 rounded-full hover:bg-gray-300 hover:cursor-pointer transition"
              >
                  {task.status}
              </button>

              {isStatusDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10 border"
                  onMouseLeave={() => setIsStatusDropdownOpen(false)} // Optional: close on mouse out
              >
                  <ul className="py-1">
                    <li className="px-3 py-1 text-xs text-gray-500">Change status:</li>
                    <button onClick={() => handleStatusChange('pending')} className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100">Pending</button>
                    <button onClick={() => handleStatusChange('in_progress')} className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100">In Progress</button>
                    <button onClick={() => handleStatusChange('completed')} className="block w-full text-left px-3 py-1 text-sm hover:bg-gray-100">Completed</button>
                  </ul>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-2">
              <button onClick={() => handleMarkComplete()} className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700 hover:cursor-pointer transition">
                <span>&#10004;</span>
              </button>

              <button onClick={() => setIsEditing(true)} className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-amber-600 hover:cursor-pointer transition">
                <span>&#9998;</span>
              </button>

              <button onClick={() => setIsDeleteModalOpen(true)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 hover:cursor-pointer transition">
                <span>&#10006;</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the task "${task.task_name}"? This action cannot be undone.`}
        confirmText="Delete"
        isConfirming={isDeleting}
      />
    </li>
    
  );
}
