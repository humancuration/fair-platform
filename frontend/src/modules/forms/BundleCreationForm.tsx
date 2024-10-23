import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useQuery } from 'react-query';
import axios from 'axios';
import { FaPlus, FaMinus, FaImage, FaCalendar } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Product } from '../../types/Product';

interface BundleFormValues {
  name: string;
  description: string;
  validFrom: Date;
  validUntil: Date;
  limitedQuantity?: number;
  imageUrl: string;
  products: Array<{
    productId: string;
    quantity: number;
    discountPercentage: number;
  }>;
}

const BundleCreationForm: React.FC = () => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');

  const { data: availableProducts } = useQuery<Product[]>('products', 
    () => axios.get('/api/products').then(res => res.data)
  );

  const formik = useFormik<BundleFormValues>({
    initialValues: {
      name: '',
      description: '',
      validFrom: new Date(),
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      limitedQuantity: undefined,
      imageUrl: '',
      products: [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      validFrom: Yup.date().required('Required'),
      validUntil: Yup.date()
        .min(Yup.ref('validFrom'), 'End date must be after start date')
        .required('Required'),
      limitedQuantity: Yup.number().min(1, 'Must be at least 1').nullable(),
      imageUrl: Yup.string().url('Must be a valid URL').required('Required'),
      products: Yup.array()
        .of(
          Yup.object({
            productId: Yup.string().required('Required'),
            quantity: Yup.number().min(1, 'Must be at least 1').required('Required'),
            discountPercentage: Yup.number()
              .min(0, 'Must be at least 0')
              .max(100, 'Must be at most 100')
              .required('Required'),
          })
        )
        .min(1, 'Must include at least one product'),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post('/api/marketplace/bundles', values);
        // Handle success (e.g., show success message, redirect)
      } catch (error) {
        // Handle error
        console.error('Error creating bundle:', error);
      }
    },
  });

  const handleProductSelect = (product: Product) => {
    if (!formik.values.products.find(p => p.productId === product.id)) {
      formik.setFieldValue('products', [
        ...formik.values.products,
        {
          productId: product.id,
          quantity: 1,
          discountPercentage: 10,
        },
      ]);
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    formik.setFieldValue(
      'products',
      formik.values.products.filter(p => p.productId !== productId)
    );
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6">Create New Bundle</h2>
      
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Bundle Name</label>
            <input
              type="text"
              {...formik.getFieldProps('name')}
              className="w-full p-2 border rounded"
            />
            {formik.touched.name && formik.errors.name && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                {...formik.getFieldProps('imageUrl')}
                className="w-full p-2 border rounded"
                onBlur={(e) => {
                  formik.handleBlur(e);
                  setPreviewImage(e.target.value);
                }}
              />
              {previewImage && (
                <div className="w-10 h-10 border rounded overflow-hidden">
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            {formik.touched.imageUrl && formik.errors.imageUrl && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.imageUrl}</div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            {...formik.getFieldProps('description')}
            rows={4}
            className="w-full p-2 border rounded"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Valid From</label>
            <DatePicker
              selected={formik.values.validFrom}
              onChange={(date) => formik.setFieldValue('validFrom', date)}
              className="w-full p-2 border rounded"
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Valid Until</label>
            <DatePicker
              selected={formik.values.validUntil}
              onChange={(date) => formik.setFieldValue('validUntil', date)}
              className="w-full p-2 border rounded"
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={formik.values.validFrom}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Limited Quantity (Optional)</label>
            <input
              type="number"
              {...formik.getFieldProps('limitedQuantity')}
              className="w-full p-2 border rounded"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Products</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {availableProducts?.map(product => (
              <motion.div
                key={product.id}
                whileHover={{ scale: 1.02 }}
                className={`p-2 border rounded cursor-pointer ${
                  selectedProducts.find(p => p.id === product.id)
                    ? 'border-blue-500 bg-blue-50'
                    : ''
                }`}
                onClick={() => handleProductSelect(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-24 object-cover mb-2 rounded"
                />
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-sm text-gray-600">${product.price}</p>
              </motion.div>
            ))}
          </div>

          {selectedProducts.length > 0 && (
            <div className="space-y-4">
              {selectedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-4 p-4 border rounded"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <div className="flex gap-4 mt-2">
                      <div>
                        <label className="text-sm">Quantity</label>
                        <input
                          type="number"
                          value={formik.values.products[index]?.quantity || 1}
                          onChange={(e) => {
                            formik.setFieldValue(
                              `products.${index}.quantity`,
                              parseInt(e.target.value)
                            );
                          }}
                          className="w-20 p-1 border rounded"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="text-sm">Discount %</label>
                        <input
                          type="number"
                          value={formik.values.products[index]?.discountPercentage || 0}
                          onChange={(e) => {
                            formik.setFieldValue(
                              `products.${index}.discountPercentage`,
                              parseInt(e.target.value)
                            );
                          }}
                          className="w-20 p-1 border rounded"
                          min="0"
                          max="100"
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaMinus />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => formik.resetForm()}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Creating...' : 'Create Bundle'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BundleCreationForm;
