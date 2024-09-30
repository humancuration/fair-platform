import React, { useEffect, useState } from 'react';
import TextInput from '../components/forms/TextInput';
import LoadingSpinner from '../components/LoadingSpinner';
import SkeletonLoader from '../components/SkeletonLoader';
import FormWrapper from '../components/forms/FormWrapper';
import * as Yup from 'yup';
import api from '../utils/api';
import useNotification from '../hooks/useNotification';
import { useError } from '../contexts/ErrorContext';

const UserProfilePage: React.FC = () => {
  const [initialValues, setInitialValues] = useState({
    name: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const { notifySuccess } = useNotification();
  const { setError } = useError();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        setInitialValues(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setError]);

  if (loading)
    return (
      <div className="max-w-lg mx-auto">
        <SkeletonLoader width="50%" height="2rem" className="mb-4" />
        <SkeletonLoader height="1.5rem" className="mb-2" />
        <SkeletonLoader height="1.5rem" className="mb-4" />
        <SkeletonLoader width="30%" height="2rem" />
      </div>
    );

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string()
      .email('Invalid email format')
      .required('Email is required'),
  });

  const handleSubmit = async (values: any, actions: any) => {
    try {
      await api.put('/user/profile', values);
      setInitialValues(values);
      notifySuccess('Profile updated successfully!');
      actions.setSubmitting(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Update failed');
      actions.setSubmitting(false);
    }
  };

  return (
    <FormWrapper
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <TextInput label="Name" name="name" type="text" />
      <TextInput label="Email" name="email" type="email" />
    </FormWrapper>
  );
};

export default UserProfilePage;
