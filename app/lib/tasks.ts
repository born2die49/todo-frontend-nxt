import apiService from "./api";
import { Task } from "./definitions";

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTasks(): Promise<Task[]> {
  return apiService.get('/api/tasks/');
}

export async function createTask(taskData: {task_name: string, due_date: string, description: string 
}): Promise<Task> {
  return apiService.post('/api/tasks/', taskData);
}

export async function updateTask(id: number, data: Partial<Task>):
Promise<Task> {
  return apiService.patch(`/api/tasks/${id}/`, data);
}

export async function deleteTask(id: number) {
  await apiService.delete(`/api/tasks/${id}/`);
}