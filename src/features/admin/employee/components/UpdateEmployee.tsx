import { useNavigate, useParams } from 'react-router-dom';
import { EmployeeForm } from '../components/EmployeeForm';
import { EmployeeHeader } from '../components/EmployeeHeader';
import { useDeleteEmployee } from '../hooks/useDeletEmployee';
import { useEmployee } from '../hooks/useEmployee';
import { useUpdateEmployee } from '../hooks/useUpdateEmployee';

export default function UpdateEmployeePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useEmployee(id);
  const updateMutation = useUpdateEmployee(id);
  const deleteMutation = useDeleteEmployee(id);

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-lg p-8">
        <EmployeeHeader onDelete={() => deleteMutation.mutate(() => navigate('/employees'))} />

        {error || updateMutation.error || deleteMutation.error ? (
          <span className="text-red-500">
            {error || updateMutation.error || deleteMutation.error}
          </span>
        ) : null}

        {loading ? (
          <span>Loading...</span>
        ) : (
          <EmployeeForm
            defaultValues={data || undefined}
            onSubmit={(formData) => updateMutation.mutate(formData, () => navigate(-1))}
            loading={updateMutation.loading}
            onCancel={() => navigate(-1)}
          />
        )}
      </div>
    </div>
  );
}
