import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from './Button';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { submitSupportForm } from '@store/slices/supportFormSlice';

const SupportForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const formState = useAppSelector(state => state.supportForm);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(submitSupportForm(formState));
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email format').required('Required'),
      message: Yup.string().required('Required'),
    }),
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values);
      resetForm();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...formik.getFieldProps('name')}
          className="mt-1 p-2 w-full border rounded"
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-red-500 text-sm">{formik.errors.name}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...formik.getFieldProps('email')}
          className="mt-1 p-2 w-full border rounded"
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500 text-sm">{formik.errors.email}</div>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium">
          Message
        </label>
        <textarea
          id="message"
          {...formik.getFieldProps('message')}
          className="mt-1 p-2 w-full border rounded"
          rows={4}
        />
        {formik.touched.message && formik.errors.message ? (
          <div className="text-red-500 text-sm">{formik.errors.message}</div>
        ) : null}
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default SupportForm;