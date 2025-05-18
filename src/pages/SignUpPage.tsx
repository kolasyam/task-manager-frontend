import React from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
}

const signupSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik<SignupFormValues>({
    initialValues: { name: "", email: "", password: "" },
    validationSchema: signupSchema,
    onSubmit: async (
      values,
      { setSubmitting, setErrors }: FormikHelpers<SignupFormValues>
    ) => {
      try {
        const response = await fetch(
          "https://task-manager-backend-1-khqc.onrender.com/api/auth/register",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Signup failed");
        }
        toast.success("Signup successful! Redirected to dashboard...");
        localStorage.setItem("usertoken", data.token);
        console.log("Signup success:", data);
        navigate("/dashboard");
      } catch (error: any) {
        console.error("Signup error:", error.message);
        toast.error(error.message || "Signup failed");
        setErrors({ email: error.message });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster />
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="mt-1 w-full border border-gray-300 px-3 py-2 rounded"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
          <div className="text-center mt-4">
            <p className="text-sm font-medium">
              Already have an account?
              <button
                type="button"
                className="text-blue-600 ml-1 underline"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
