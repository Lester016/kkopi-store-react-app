// src/shared/components/Button.tsx

import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'icon';
  fullWidth?: boolean;
};

export const Button = ({
  variant = 'primary',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const base =
    'inline-flex items-center justify-center gap-1 rounded-lg text-sm transition font-medium px-4 py-2';

  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50';
      break;
    case 'secondary':
      variantClasses = 'text-gray-600 hover:bg-gray-100 disabled:opacity-50';
      break;
    case 'danger':
      variantClasses = 'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50';
      break;
    case 'success':
      variantClasses = 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50';
      break;
    case 'icon':
      variantClasses =
        'p-2 border text-gray-600 border-gray-300 hover:bg-gray-100 ' +
        'disabled:text-gray-300 disabled:border-gray-200 disabled:cursor-not-allowed';
      break;
  }

  return (
    <button
      {...props}
      disabled={disabled}
      className={`${base} ${variantClasses} ${fullWidth ? 'w-full' : ''} ${className}`}
    />
  );
};
