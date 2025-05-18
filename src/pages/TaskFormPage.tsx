import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";

const TaskFormPage: React.FC = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    title: Yup.string().trim().required("Task title is required"),
    description: Yup.string().trim(),
  });

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleSubmit = async (
    values: { title: string; description: string },
    { setSubmitting, setFieldError }: any
  ) => {
    const token = localStorage.getItem("usertoken");
    try {
      const response = await fetch(
        "https://task-manager-backend-1-khqc.onrender.com/api/task",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setFieldError("title", data.message || "Failed to create task");
        throw new Error(data.message || "Failed to create task");
      }
      toast.success("Task Added Successfully");

      navigate("/dashboard");
    } catch (err: any) {
      console.error("Error creating task:", err);
      setFieldError(
        "title",
        err.message || "Failed to create task. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <Toaster />
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Task</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            Close
          </button>
        </div>

        <Formik
          initialValues={{ title: "", description: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 mb-2">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <Field
                  name="title"
                  type="text"
                  placeholder="Enter task title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-gray-700 mb-2"
                >
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  placeholder="Describe your task"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Task"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TaskFormPage;
