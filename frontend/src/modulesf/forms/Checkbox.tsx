import React from 'react';
import { useField } from 'formik';

interface CheckboxProps {
  name: string;
  label: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, ...props }) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' });
  return (
    <div className="mb-4 flex items-center">
      <input
        {...field}
        {...props}
        type="checkbox"
        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label htmlFor={props.name} className="text-sm">
        {label}
      </label>
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm ml-2">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default Checkbox;