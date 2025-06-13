import apiService from "./api";
import { Task } from "../types/task"; 

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getTasks(): Promise<Task[]> {
  return apiService.get('/tasks/');
}

export async function createTask(taskData: {task_name: string;
  description: string 
}): Promise<Task> {
  return apiService.post('/tasks/', taskData);
}

export async function updateTask(id: number, data: Partial<Task>):
Promise<Task> {
  return apiService.patch(`/tasks/${id}/`, data);
}

export async function deleteTask(id: number) {
  await apiService.delete(`/tasks/${id}/`);
}