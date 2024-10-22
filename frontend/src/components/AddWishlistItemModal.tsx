import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import Modal from './common/Modal';
import Button from './common/Button';
import TextInput from './forms/TextInput';
import { WishlistItem } from '~/types/wishlist';

interface AddWishlistItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: Omit<WishlistItem, 'id'>) => void;
}

const AddWishlistItemModal: React.FC<AddWishlistItemModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      image: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      image: Yup.string().url('Invalid URL').optional(),
    }),
    onSubmit: (values) => {
      onAdd(values);
      formik.resetForm();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Wishlist Item">
      <Form onSubmit={formik.handleSubmit}>
        <TextInput
          label="Item Name"
          name="name"
          type="text"
          {...formik.getFieldProps('name')}
          error={formik.touched.name && formik.errors.name}
        />
        <TextInput
          label="Description"
          name="description"
          type="textarea"
          {...formik.getFieldProps('description')}
          error={formik.touched.description && formik.errors.description}
        />
        <TextInput
          label="Image URL (optional)"
          name="image"
          type="url"
          {...formik.getFieldProps('image')}
          error={formik.touched.image && formik.errors.image}
        />
        <ButtonGroup>
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button type="submit">Add Item</Button>
        </ButtonGroup>
      </Form>
    </Modal>
  );
};

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

export default AddWishlistItemModal;
