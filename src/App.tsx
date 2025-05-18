import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUpPage";
import Dashboard from "./pages/Dashboard";
import ProjectForm from "./pages/TaskFormPage";
import EditTask from "./pages/EditTask";
import PrivateRoute from "./pages/PrivateRoute";
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-task"
        element={
          <PrivateRoute>
            <ProjectForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/task/:taskId"
        element={
          <PrivateRoute>
            <EditTask />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;
