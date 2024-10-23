import React from 'react';
import { useField } from 'formik';

interface TextInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
}

const TextInput: React.FC<TextInputProps> = ({ label, className = '', ...props }) => {
  const [field, meta] = useField(props);

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={props.name}>
        {label}
      </label>
      <input
        {...field}
        {...props}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          meta.touched && meta.error ? 'border-red-500' : ''
        } ${className}`}
      />
      {meta.touched && meta.error ? (
        <p className="text-red-500 text-xs italic">{meta.error}</p>
      ) : null}
    </div>
  );
};

export default TextInput;
