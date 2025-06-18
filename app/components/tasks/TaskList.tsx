import { getTasks } from "@/app/lib/tasks";
import { Task } from "@/app/lib/definitions";
import { AddTaskForm } from "@/app/components/tasks/AddTaskForm";
import { TaskItem } from "@/app/components/tasks/TaskItem";
import serverApi from "@/app/lib/serverApi";


const TaskList = async () => {
    // const tasks: Task[] = await getTasks();
    let tasks: Task[] = [];
    try {
      const response = await serverApi('/api/tasks/'); // This calls your Django backend

      if (response.ok) {
        tasks = await response.json();
      } else {
        // This will show up in your terminal where you run `npm run dev`
        console.error("Failed to fetch tasks:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while fetching tasks:", error);
    }

    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

        {/* Task List */}
        <div className="grid md:grid-cols-5 lg:grid-cols-3">
          <div className="md:col-span-3 md:col-start-2 lg:col-span-1 lg:col-start-2">
            <div className="space-y-2 max-h-[50vh] overflow-y-auto">
              {tasks.length === 0 ? (
                <p>No tasks found. Try adding one!</p>
              ) : (
                <ul>
                  {tasks.map(task => (
                    <TaskItem key={task.id} task={task}/>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        
        {/* Task Form */}
        <div className="grid md:grid-cols-5 lg:grid-cols-3 mt-5">
          <div className="md:col-span-3 md:col-start-2 lg:col-span-1 lg:col-start-2">
            <AddTaskForm/>
          </div>
        </div>
      </main>
    )
}

export default TaskList;