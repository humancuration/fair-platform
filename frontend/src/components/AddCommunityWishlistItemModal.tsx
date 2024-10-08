import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from './common/Button';
import TextInput from './forms/TextInput';

interface AddCommunityWishlistItemModalProps {
  onAdd: (item: {
    user: string;
    name: string;
    description: string;
    image?: string;
    targetAmount: number;
  }) => void;
  onClose: () => void;
}

const AddCommunityWishlistItemModal: React.FC<AddCommunityWishlistItemModalProps> = ({ onAdd, onClose }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      image: '',
      targetAmount: 0,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      image: Yup.string().url('Invalid URL').optional(),
      targetAmount: Yup.number().min(1, 'Must be at least $1').required('Required'),
    }),
    onSubmit: (values) => {
      onAdd({
        user: '', // Assign current user ID or username if needed
        name: values.name,
        description: values.description,
        image: values.image || '',
        targetAmount: values.targetAmount,
      });
      formik.resetForm();
      onClose();
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <TextInput
        label="Item Name"
        name="name"
        type="text"
        {...formik.getFieldProps('name')}
      />
      <TextInput
        label="Description"
        name="description"
        type="textarea"
        {...formik.getFieldProps('description')}
      />
      <TextInput
        label="Image URL (optional)"
        name="image"
        type="url"
        {...formik.getFieldProps('image')}
      />
      <TextInput
        label="Target Amount ($)"
        name="targetAmount"
        type="number"
        min="1"
        {...formik.getFieldProps('targetAmount')}
      />
      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onClose} variant="secondary">
          Cancel
        </Button>
        <Button type="submit">Add Item</Button>
      </div>
    </form>
  );
};

export default AddCommunityWishlistItemModal;