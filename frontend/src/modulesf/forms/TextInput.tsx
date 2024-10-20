import React from 'react';
import { useField } from 'formik';

interface TextInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}

const TextInput: React.FC<TextInputProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  return (
    <div className="mb-4">
      <label htmlFor={props.name} className="block text-sm font-medium mb-1">
        {label}
      </label>
      <input
        {...field}
        {...props}
        className={`w-full border rounded px-3 py-2 dark:bg-gray-700 dark:text-gray-200 ${
          meta.touched && meta.error ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default TextInput;