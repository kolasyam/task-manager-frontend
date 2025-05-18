import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

interface Task {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  createdBy: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("usertoken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Fetch User Data
        const userResponse = await fetch(
          "https://task-manager-backend-1-khqc.onrender.com/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!userResponse.ok) throw new Error("Failed to fetch user profile");
        const userData: User = await userResponse.json();
        setUser(userData);

        // Fetch Tasks
        const tasksResponse = await fetch(
          "https://task-manager-backend-1-khqc.onrender.com/api/task",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!tasksResponse.ok) throw new Error("Failed to fetch tasks");
        const tasksData: Task[] = await tasksResponse.json();
        setTasks(tasksData);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("usertoken");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditTitle("");
    setEditDescription("");
  };
  const handleUpdate = async () => {
    if (!editingTask) return;

    const token = localStorage.getItem("usertoken");

    try {
      const response = await fetch(
        `https://task-manager-backend-1-khqc.onrender.com/api/task/${editingTask._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editTitle,
            description: editDescription,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update task");
      toast.success("Task Update Successfully");
      const updatedTask: Task = await response.json();

      setTasks((prev) =>
        prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
      setEditingTask(null);
    } catch (error: any) {
      toast.error("A task with the same title and description already exists");
      alert("Failed to delete task. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("usertoken");
    navigate("/login");
  };

  const handleDelete = async (taskId: string) => {
    const token = localStorage.getItem("usertoken");
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmDelete || !token) return;

    try {
      const response = await fetch(
        `https://task-manager-backend-1-khqc.onrender.com/api/task/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete task");

      // Remove the deleted task from UI
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      toast.success("Delete Successfully");
    } catch (error) {
      console.error(error);
      toast.error("Delete is failed");
      alert("Failed to delete task. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <header className="flex justify-between items-center bg-blue-100 p-8">
        <Toaster />
        <h1 className="text-2xl font-bold text-blue-600">Task Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium text-gray-800">
            Hello, {user?.name || "User"}
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md shadow"
          >
            Logout
          </button>
        </div>
      </header>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-extrabold text-blue-700">My Tasks</h1>
            <button
              onClick={() => navigate("/create-task")}
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
            >
              Create Task
              {/* <ArrowRight className="ml-2 w-5 h-5" /> */}
            </button>
          </div>

          {!Array.isArray(tasks) || tasks.length === 0 ? (
            <div className="text-center text-gray-600 text-xl mt-20">
              No tasks found. Create your first task!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-gradient-to-tr from-white to-blue-50 border border-gray-200 rounded-xl shadow-md p-5 flex flex-col justify-between transition-transform transform hover:scale-[1.02] hover:shadow-lg"
                >
                  {editingTask?._id === task._id ? (
                    <>
                      <input
                        className="mb-2 p-2 border rounded w-full"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        placeholder="Title"
                      />
                      <textarea
                        className="mb-2 p-2 border rounded w-full"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={handleUpdate}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded-lg text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <h3 className="text-xl font-bold text-blue-700 mb-2">
                          {task.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{task.description}</p>
                        <p className="text-sm text-gray-400">
                          Created:{" "}
                          {new Date(task.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex justify-end mt-4 space-x-3">
                        <button
                          onClick={() => handleEdit(task)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-lg text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(task._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
