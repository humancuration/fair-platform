import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from './common/Button';
import TextInput from './forms/TextInput';
import Checkbox from './forms/Checkbox';

interface AddWishlistItemModalProps {
  onAdd: (item: { name: string; description: string; image?: string; isPublic: boolean }) => void;
  onClose: () => void;
}

const AddWishlistItemModal: React.FC<AddWishlistItemModalProps> = ({ onAdd, onClose }) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      image: '',
      isPublic: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      image: Yup.string().url('Invalid URL').optional(),
      isPublic: Yup.boolean(),
    }),
    onSubmit: (values) => {
      onAdd(values);
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
      <Checkbox
        name="isPublic"
        label="Make Public"
        {...formik.getFieldProps('isPublic')}
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

export default AddWishlistItemModal;