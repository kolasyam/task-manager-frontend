// // src/components/PrivateRoute.tsx
// import React from "react";
// import { Navigate } from "react-router-dom";
// // import toast, { Toaster } from "react-hot-toast";

// const PrivateRoute = ({ children }: { children: ReactElement }) => {
//   const token = localStorage.getItem("usertoken");
//   //   toast.success("Please Login before going to dashboard");
//   if (!token) {
//     return (
//       <div>
//         {/* <Toaster /> */}
//         <Navigate to="/login" replace />;
//       </div>
//     );
//   }

//   return children;
// };

// export default PrivateRoute;
// src/components/PrivateRoute.tsx
import React, { ReactElement } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = localStorage.getItem("usertoken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
