import { useField } from '@remix-run/react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// Styled components for form elements
export const FormContainer = styled(motion.form)`
  max-width: 32rem;
  margin: 0 auto;
  padding: 1.5rem;
`;

export const FormField = styled.div`
  margin-bottom: 1rem;
`;

export const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    ring: 2px #4f46e5;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    ring: 2px #4f46e5;
  }
`;

export const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

// Form field components using Remix hooks
interface FieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
}

export const FormInput: React.FC<FieldProps> = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  
  return (
    <FormField>
      <Label htmlFor={props.name}>{label}</Label>
      <Input {...field} {...props} id={props.name} />
      {meta.error && <ErrorMessage>{meta.error}</ErrorMessage>}
    </FormField>
  );
};

export const FormTextArea: React.FC<FieldProps & { rows?: number }> = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  
  return (
    <FormField>
      <Label htmlFor={props.name}>{label}</Label>
      <TextArea {...field} {...props} id={props.name} />
      {meta.error && <ErrorMessage>{meta.error}</ErrorMessage>}
    </FormField>
  );
};
