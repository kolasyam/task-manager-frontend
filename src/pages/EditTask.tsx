import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditTask: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      const token = localStorage.getItem("usertoken");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `https://task-manager-backend-1-khqc.onrender.com/api/task/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch task");

        const task = await res.json();
        setTitle(task.title);
        setDescription(task.description);
      } catch (error) {
        console.error(error);
        alert("Error loading task");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("usertoken");
    if (!token) return;

    try {
      const res = await fetch(
        `https://task-manager-backend-1-khqc.onrender.com/api/task/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update task");
      }

      alert("Task updated successfully!");
      navigate("/dashboard"); // or wherever your dashboard route is
    } catch (error: any) {
      alert(error.message || "Failed to update task");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
        Loading task...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-blue-600">Edit Task</h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Update Task
        </button>
      </form>
    </div>
  );
};

export default EditTask;
