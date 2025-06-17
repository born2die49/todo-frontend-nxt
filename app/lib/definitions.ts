export type Task = {
  id: number;
  task_name: string;
  description: string;
  add_date: string;
  due_date: string | null;
  duration_minutes: number | null;
  status: 'pending' | 'in_progress' | 'completed';
  category: number | null;
  task_type: 'work' | 'personal' | null;
}