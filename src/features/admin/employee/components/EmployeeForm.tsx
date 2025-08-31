import { useForm } from 'react-hook-form';
import { Button } from '../../../../shared/components/Button';
import { Input } from '../../../../shared/components/Input';
import type { EmployeeFormInputs } from '../types/employee.types';

interface Props {
  defaultValues?: EmployeeFormInputs;
  onSubmit: (data: EmployeeFormInputs) => void;
  loading: boolean;
  onCancel: () => void;
}

export const EmployeeForm = ({ defaultValues, onSubmit, loading, onCancel }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormInputs>({
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
      noValidate
    >
      <Input label="Email" type="email" {...register('email', { required: 'Email is required' })} />
      {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}

      <Input label="Password (Optional)" type="password" {...register('password')} />

      <Input
        label="First Name"
        type="text"
        {...register('firstName', { required: 'First name is required' })}
      />
      <Input
        label="Last Name"
        type="text"
        {...register('lastName', { required: 'Last name is required' })}
      />

      <Input label="Position" type="text" {...register('position')} />
      <Input label="Branch" type="text" {...register('branch')} />
      <Input label="Contact" type="text" {...register('phone')} />
      <Input label="Start Date" type="date" {...register('startDate')} />

      <div className="col-span-2 flex justify-between">
        <Button type="button" onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button type="submit" disabled={loading} variant="primary">
          {loading ? 'Loading...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
