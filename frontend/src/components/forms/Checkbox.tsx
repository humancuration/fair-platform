import React from 'react';
import { useField } from 'formik';

interface CheckboxProps {
  label: string;
  name: string;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', ...props }) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' });

  return (
    <div className="mb-4">
      <label className="flex items-center">
        <input
          type="checkbox"
          {...field}
          {...props}
          className={`mr-2 leading-tight ${className}`}
        />
        <span className="text-sm">{label}</span>
      </label>
      {meta.touched && meta.error ? (
        <p className="text-red-500 text-xs italic">{meta.error}</p>
      ) : null}
    </div>
  );
};

export default Checkbox;
