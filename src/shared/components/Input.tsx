import type { FieldError } from 'react-hook-form';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: FieldError;
};

export const Input = ({ label, error, ...props }: InputProps) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-medium text-gray-700 mb-2">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
    />
    {error && <p className="text-red-500 text-xs mt-2">{error.message}</p>}
  </div>
);
