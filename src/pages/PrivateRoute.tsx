// src/components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
// import toast, { Toaster } from "react-hot-toast";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("usertoken");
  //   toast.success("Please Login before going to dashboard");
  if (!token) {
    return (
      <div>
        {/* <Toaster /> */}
        <Navigate to="/login" replace />;
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
