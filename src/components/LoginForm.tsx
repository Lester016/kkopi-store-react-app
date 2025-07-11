import React, { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { login } from "../api/authApi";

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const [errorMessage, setErrorMessage] = useState(null as string | null);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const result = await login(data);
      console.log("Login success:", result);

      // Store token or user data
      localStorage.setItem("token", result);
      setErrorMessage(null); // Clear on success
      // Redirect or update auth state

    } catch (error: any) {
      console.error("Login error:", error?.response?.data || error.message);
      if (error.response?.data?.error) {
        setErrorMessage(error?.response?.data?.error);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg border bg-white">
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

      {errorMessage && (
        <p className="text-red-600 text-sm mb-4 text-center">{errorMessage}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="johndoe@gmail.com"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value:
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 border rounded-lg"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
