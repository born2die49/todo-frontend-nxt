// In app/page.tsx
import { getUserId } from "@/app/lib/actions";
import serverApi from "@/app/lib/serverApi";
import Link from 'next/link';
import Button from "../ui/Button";

// Define simple types for the data we fetch
interface UserProfile { name?: string; }
interface Task {
  status: string; id: number; 
}

export default async function HomePage() {
  const userId = await getUserId();
  let userName: string | null = null;
  let taskCount = 0;

  if (userId) {
    // Fetch user profile and task count in parallel for efficiency
    const [profileResponse, tasksResponse] = await Promise.all([
      serverApi('/api/auth/profile/'),
      serverApi('/api/tasks/')
    ]);

    if (profileResponse.ok) {
      const profile: UserProfile = await profileResponse.json();
      userName = profile.name || 'User';
    }
    if (tasksResponse.ok) {
      const tasks: Task[] = await tasksResponse.json();
      taskCount = tasks.filter(task => task.status !== 'completed').length;
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold">Welcome to Your Task Manager</h1>
        
        {userId ? (
          <div className="mt-8">
            <p className="text-2xl">
              Hello, <span className="text-blue-500">{userName || 'friend'}</span>!
            </p>
            <p className="text-lg text-gray-600 mt-2">
              You have {taskCount} task{taskCount !== 1 ? 's' : ''} waiting for you.
            </p>
            <Link href="/tasks" className="mt-6 inline-block">
              <Button size="lg">Go to My Tasks</Button>
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            <p className="text-lg text-gray-600">
              Log in to manage your life, one task at a time.
            </p>
            {/* You can add login/signup buttons here if you want, or rely on the navbar */}
          </div>
        )}
      </div>
    </main>
  );
}