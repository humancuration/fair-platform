import React from 'react';
import { useField } from 'formik';

interface SelectProps {
  label: string;
  name: string;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({ label, options, ...props }) => {
  const [field, meta] = useField(props.name);
  return (
    <div className="mb-4">
      <label htmlFor={props.name} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <select
        {...field}
        {...props}
        className={`w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 ${
          meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
        }`}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default Select;