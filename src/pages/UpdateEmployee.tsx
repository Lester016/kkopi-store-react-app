import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../shared/api/axiosInstance';
import { Input } from '../shared/components/Input';

export default function UpdateEmployee() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Updated Employee:', data);
    // Integrate with your API call here
  };

  // Fetch employee details on mount
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/users/${id}`);
        const user = res.data.user;
        console.log('Fetched Employee:', { ...user, ...user.employeeDetails });
        reset({
          ...user,
          ...user.employeeDetails,
        });
      } catch (err) {
        console.error('Error fetching employee:', err);
        setFetchError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, reset]);

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/api/users/${id}`);
      navigate('/employees'); // Redirect to employees list after deletion
    } catch (err) {
      console.error('Error deleting employee:', err);
      setFetchError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-lg">
        <div className="p-8">
          {/* Header with title (left) and delete (right) */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Update Employee</h2>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-sm text-gray-600 hover:text-red-600 hover:bg-gray-50 transition"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="john.doe@example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password (Optional)
              </label>
              <input
                type="password"
                placeholder="********"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register('password')}
              />
              {errors.password && (
                <span className="text-sm text-red-500">{errors.password.message}</span>
              )}
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                placeholder="John"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register('firstName', { required: 'First name is required' })}
              />
              {errors.firstName && (
                <span className="text-sm text-red-500">{errors.firstName.message}</span>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                {...register('lastName', { required: 'Last name is required' })}
              />
              {errors.lastName && (
                <span className="text-sm text-red-500">{errors.lastName.message}</span>
              )}
            </div>

            {/* Position */}
            <Input
              label="Position"
              type="text"
              placeholder="Staff"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register('position')}
            />

            {/* Branch */}
            <Input
              label="Branch"
              type="text"
              placeholder="Manila"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register('branch')}
            />

            {/* Contact */}
            <Input
              label="Contact"
              type="text"
              placeholder="+63 900 000 000"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register('phone')}
            />

            {/* Start Date */}
            <Input
              label="Start Date"
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              {...register('startDate')}
            />

            {/* Footer: Cancel + Save */}
            <div className="col-span-1 md:col-span-2 flex justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)} // replace with your cancel handler
                className="inline-flex items-center justify-center px-6 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
