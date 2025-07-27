import type { AxiosError } from 'axios';
import { useForm, type SubmitHandler } from 'react-hook-form';
import axiosInstance from '../api/axiosInstance';
import { useAuthStore } from '../store/authStore';

type LoginFormInputs = {
  email: string;
  password: string;
};

const Login = () => {
  const error = useAuthStore((s) => s.error);
  const loading = useAuthStore((s) => s.loading);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setLoading = useAuthStore((s) => s.setLoading);
  const setError = useAuthStore((s) => s.setError);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const { email, password } = data;
    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/login', { email, password });
      setAuth({ access: response.data.access, refresh: response.data.refresh });
      setLoading(false);
      setError(null);
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      console.log('Login error:', error);
      setError(error?.response?.data?.error ?? null);
      setLoading(false);
      throw error;
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg border bg-white">
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

      {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}

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
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Enter a valid email',
              },
            })}
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 border rounded-lg"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters',
              },
            })}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
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

export default Login;
