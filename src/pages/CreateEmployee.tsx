import type { AxiosError } from 'axios';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../shared/api/axiosInstance';
import { Input } from '../shared/components/Input';

export default function CreateEmployee() {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      position: '',
      branch: '',
      address: '',
      contact: '',
      startDate: '',
    },
  });

  const password = watch('password');

  const nextStep = async () => {
    const isValid = await trigger([
      'email',
      'password',
      'confirmPassword',
      'firstName',
      'lastName',
    ]);
    if (!isValid) return;

    try {
      setLoading(true);
      const payload = {
        email: watch('email'),
        password: watch('password'),
        firstName: watch('firstName'),
        lastName: watch('lastName'),
      };

      const res = await axiosInstance.post('/api/register', payload);

      if (res.data.message?.toLowerCase().includes('success')) {
        setUserId(res.data.user.id);
        setStep(2);
      } else {
        console.error('User creation failed:', res.data);
      }
    } catch (err) {
      console.error('Error creating user:', err);
      const error = err as AxiosError<{ message: string }>;

      setErrorMessage(
        error.response?.data?.message || 'An error occurred while creating the user.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    if (!userId) return console.error('Missing user email from step 1');

    try {
      setLoading(true);
      const detailsPayload = {
        position: data.position,
        branch: data.branch,
        phone: data.contact,
        startDate: data.startDate,
      };

      const res = await axiosInstance.post(`/api/users/${userId}/create-employee`, detailsPayload);

      if (res.data.message?.toLowerCase().includes('success')) {
        alert('Employee created successfully!');
        // Reset or redirect as needed
      } else {
        console.error('Details update failed:', res.data);
      }
    } catch (err) {
      console.error('Error creating user details:', err);
      const error = err as AxiosError<{ message: string }>;

      setErrorMessage(
        error.response?.data?.message || 'An error occurred while creating the user.'
      );
    } finally {
      setErrorMessage(null);
      setLoading(false);
      navigate(-1);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <motion.div
        className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {step === 1 && (
            <>
              <h2 className="text-2xl font-bold mb-2">Create New Employee</h2>

              {/** Email */}
              <div className="flex flex-col gap-1">
                <label>Email</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className={`w-full px-4 py-2 border rounded-xl ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              </div>

              {/** Password */}
              <div className="flex flex-col gap-1">
                <label>Password</label>
                <input
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                  })}
                  className={`w-full px-4 py-2 border rounded-xl ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>

              {/** Confirm Password */}
              <div className="flex flex-col gap-1">
                <label>Confirm Password</label>
                <input
                  type="password"
                  {...register('confirmPassword', {
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  className={`w-full px-4 py-2 border rounded-xl ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/** First Name */}
              <div className="flex flex-col gap-1">
                <label>First Name</label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  className={`w-full px-4 py-2 border rounded-xl ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                )}
              </div>

              {/** Last Name */}
              <div className="flex flex-col gap-1">
                <label>Last Name</label>
                <input
                  {...register('lastName', { required: 'Last name is required' })}
                  className={`w-full px-4 py-2 border rounded-xl ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">{errors.lastName.message}</p>
                )}
              </div>

              <button
                type="button"
                onClick={nextStep}
                disabled={loading}
                className="bg-blue-600 text-white py-2 px-4 rounded-xl mt-4 hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Next'}
              </button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-2xl font-bold mb-2">Additional Details</h2>

              {/** Position */}
              <div className="flex flex-col gap-1">
                <label>Position</label>
                <input
                  {...register('position', { required: 'Position is required' })}
                  className={`w-full px-4 py-2 border rounded-xl ${
                    errors.position ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.position && (
                  <p className="text-red-500 text-sm">{errors.position.message}</p>
                )}
              </div>

              {/** Branch */}
              <div className="flex flex-col gap-1">
                <label>Branch</label>
                <input
                  {...register('branch', { required: 'Branch is required' })}
                  className={`w-full px-4 py-2 border rounded-xl ${
                    errors.branch ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.branch && <p className="text-red-500 text-sm">{errors.branch.message}</p>}
              </div>

              {/** Contact */}
              <div className="flex flex-col gap-1">
                <label>Contact</label>
                <input
                  {...register('contact', { required: 'Contact is required' })}
                  className={`w-full px-4 py-2 border rounded-xl ${
                    errors.contact ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
              </div>

              {/** Start Date */}
              <div className="flex flex-col gap-1">
                <Input
                  label="Start Date"
                  type="date"
                  {...register('startDate', { required: 'Start date is required' })}
                  className={`w-full px-4 py-2 border rounded-xl ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && (
                  <p className="text-red-500 text-sm">{errors.startDate.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white py-2 px-4 rounded-xl mt-4 hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </>
          )}
        </form>
      </motion.div>
    </div>
  );
}
