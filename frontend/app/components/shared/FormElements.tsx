import { useField } from 'remix-validated-form';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  className?: string;
}

export function FormField({ 
  label, 
  name, 
  type = 'text',
  placeholder,
  className = ''
}: FormFieldProps) {
  const { error, getInputProps } = useField(name);
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        {...getInputProps({ id: name })}
        type={type}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2 rounded-full
          bg-white/20 border-none
          text-white placeholder-white/60
          focus:ring-2 focus:ring-white/30
          transition duration-200
          ${className}
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-200">{error}</p>
      )}
    </div>
  );
}
