import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const loginSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
  });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await fetch(
          "https://task-manager-backend-1-khqc.onrender.com/api/auth/login",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );

        if (response.status === 401) {
          throw new Error("Invalid email or password");
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Login failed");
        }
        toast.success("Signin successful! Redirected to dashboard...");

        localStorage.setItem("usertoken", data.token);
        console.log(data.token);
        navigate("/dashboard");
      } catch (error: any) {
        toast.error(error.message || "Signin failed");
        setErrors({ email: error.message });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster />
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        {/* <h2 className="text-2xl font-bold text-center mb-6">Login</h2> */}
        <h2 className="text-3xl font-bold text-center mb-6">
          Login to your account
        </h2>
        <p className="text-center mb-6">
          Or{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            create a new account
          </Link>
        </p>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
          >
            {formik.isSubmitting ? "Logging in..." : "Login"}
          </button>
          <Link
            to="/"
            className="text-indigo-600 hover:underline flex justify-center mt-2"
          >
            Home
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
