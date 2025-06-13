import { getTasks } from "../services/tasks";
import { Task } from "../types/task";
import { AddTaskForm } from "./components/AddTaskForm";
import { TaskItem } from "./components/TaskItem";


const Tasks = async () => {
    const tasks: Task[] = await getTasks();

    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

        {/* Task List */}
        <div className="grid md:grid-cols-5 lg:grid-cols-3">
          <div className="md:col-span-3 md:col-start-2 lg:col-span-1 lg:col-start-2">
            <div className="space-y-2">
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

export default Tasks;