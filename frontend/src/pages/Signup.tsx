import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import TextInput from '../components/forms/TextInput';
import Checkbox from '../components/forms/Checkbox';
import Button from '../components/common/Button';
import { signUp } from '../services/authService';
import { handleError } from '../../app/utils/error-handler-client';

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
  name: Yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required')
    .max(255, 'Email must be less than 255 characters'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
  agreeToTerms: Yup.boolean()
    .oneOf([true], 'You must agree to the terms')
    .required('You must agree to the terms'),
});

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values: SignupValues, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    try {
      await signUp(values);
      toast.success('Signup successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (err) {
      handleError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <button
              onClick={() => navigate('/login')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your account
            </button>
          </p>
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="mt-8 space-y-6">
              <TextInput label="Name" name="name" type="text" placeholder="John Doe" />
              <TextInput label="Email" name="email" type="email" placeholder="john@example.com" />
              <TextInput label="Password" name="password" type="password" />
              <TextInput label="Confirm Password" name="confirmPassword" type="password" />
              <Checkbox name="agreeToTerms" label="I agree to the terms and conditions" />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isSubmitting ? 'Creating account...' : 'Sign up'}
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignupPage;
