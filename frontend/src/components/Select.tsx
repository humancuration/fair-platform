import React from 'react';
import styled from 'styled-components';

interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}

const SelectWrapper = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.text};
`;

const SelectElement = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.secondary};
  border-radius: 5px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.text};
`;

const Select: React.FC<SelectProps> = ({ label, name, value, onChange, options }) => {
  return (
    <SelectWrapper>
      <Label htmlFor={name}>{label}</Label>
      <SelectElement id={name} name={name} value={value} onChange={onChange}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </SelectElement>
    </SelectWrapper>
  );
};

export default Select;