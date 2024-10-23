// New shared component file
import { useField } from 'formik';
import styled from 'styled-components';

export const EnchantedInput = styled.input`
  width: 100%;
  padding: 10px 15px;
  border: none;
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  }
`;

export const FormField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <EnchantedInput {...field} {...props} />
      {meta.touched && meta.error && (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      )}
    </div>
  );
};
