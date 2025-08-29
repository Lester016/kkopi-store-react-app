import type { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../../app/store';
import { Button } from '../../../shared/components/Button';
import { login } from '../services/login';
import type { LoginFormInputs } from '../types/login.types';

export const LoginForm = () => {
  const { setAuth, setLoading, setError, loading, error } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  const onSubmit = async (data: LoginFormInputs) => {
    setLoading(true);
    try {
      const tokens = await login(data);
      setAuth(tokens);
      setError(null);
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      setError(error?.response?.data?.error ?? 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {error && <p className="text-red-500 text-sm mb-2 text-center font-medium">{error}</p>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: 'Enter a valid email',
            },
          })}
        />
        {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
        />
        {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password.message}</p>}
      </div>

      <Button className="py-3 text-black font-semibold shadow-md" fullWidth>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
};
