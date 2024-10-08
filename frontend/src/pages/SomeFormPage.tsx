import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import TextInput from '../components/forms/TextInput';
import Button from '../components/common/Button';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Required'),
  password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
});

const SomeFormPage: React.FC = () => {
  const handleSubmit = (values: any) => {
    console.log(values);
    // Handle form submission
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <TextInput name="email" label="Email" type="email" />
          <TextInput name="password" label="Password" type="password" />
          <Button type="submit">Submit</Button>
        </Form>
      </Formik>
    </div>
  );
};

export default SomeFormPage;