import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useError } from '../contexts/ErrorContext';
import { Formik, Form, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import TextInput from '../components/forms/TextInput';
import Checkbox from '../components/forms/Checkbox';
import Button from '../components/common/Button';
import { signUp } from '../services/authService';
import { handleError } from '../utils/errorHandler';

interface SignupValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

const initialValues: SignupValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
};

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms')
    .required('You must agree to the terms'),
});

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { setError } = useError();

  const handleSubmit = async (values: SignupValues, { setSubmitting }: FormikHelpers<SignupValues>) => {
    try {
      await signUp(values);
      toast.success('Signup successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (err: any) {
      handleError(err, setError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <TextInput label="Name" name="name" type="text" />
            <TextInput label="Email" name="email" type="email" />
            <TextInput label="Password" name="password" type="password" />
            <TextInput label="Confirm Password" name="confirmPassword" type="password" />
            <Checkbox name="agreeToTerms" label="I agree to the terms and conditions" />
            <Button type="submit" disabled={isSubmitting} className="w-full mt-4">
              {isSubmitting ? 'Signing up...' : 'Sign Up'}
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignupPage;
