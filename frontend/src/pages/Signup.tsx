import React from 'react';
import FormWrapper from '../components/forms/FormWrapper';
import TextInput from '../components/forms/TextInput';
import Checkbox from '../components/forms/Checkbox';
import * as Yup from 'yup';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { useError } from '../contexts/ErrorContext';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setError } = useError();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    agreeToTerms: false,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    agreeToTerms: Yup.boolean()
      .oneOf([true], 'You must agree to the terms')
      .required('You must agree to the terms'),
  });

  const handleSubmit = async (values: any, actions: any) => {
    try {
      await api.post('/auth/signup', values);
      actions.setSubmitting(false);
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
      actions.setSubmitting(false);
    }
  };

  return (
    <FormWrapper
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <TextInput label="Name" name="name" type="text" placeholder="Your Name" />
      <TextInput label="Email" name="email" type="email" placeholder="you@example.com" />
      <TextInput
        label="Password"
        name="password"
        type="password"
        placeholder="********"
      />
      <Checkbox name="agreeToTerms" label="I agree to the terms and conditions" />
    </FormWrapper>
  );
};

export default SignupPage;
