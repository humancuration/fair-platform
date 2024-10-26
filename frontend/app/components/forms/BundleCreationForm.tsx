import { Form, useActionData, useTransition } from '@remix-run/react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import { FormInput, FormTextArea, FormContainer } from './FormElements';
import type { Product } from '~/types/product';

interface BundleCreationFormProps {
  availableProducts: Product[];
}

export default function BundleCreationForm({ availableProducts }: BundleCreationFormProps) {
  const actionData = useActionData();
  const transition = useTransition();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [previewImage, setPreviewImage] = useState('');

  const isSubmitting = transition.state === "submitting";

  const handleProductSelect = (product: Product) => {
    if (!selectedProducts.find(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  return (
    <FormContainer
      as={Form}
      method="post"
      encType="multipart/form-data"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <FormInput
        name="name"
        label="Bundle Name"
        type="text"
        required
      />

      <FormInput
        name="imageUrl"
        label="Image URL"
        type="url"
        required
        onBlur={(e) => setPreviewImage(e.target.value)}
      />

      <FormTextArea
        name="description"
        label="Description"
        rows={4}
        required
      />

      {/* Date inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Valid From</label>
          <DatePicker
            selected={validFrom}
            onChange={(date) => setValidFrom(date)}
            className="w-full p-2 border rounded"
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Valid Until</label>
          <DatePicker
            selected={validUntil}
            onChange={(date) => setValidUntil(date)}
            className="w-full p-2 border rounded"
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={validFrom}
          />
        </div>
      </div>

      {/* Product Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Select Products</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {availableProducts.map(product => (
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
      </div>

      {/* Selected Products */}
      {selectedProducts.map((product, index) => (
        <input
          key={product.id}
          type="hidden"
          name={`products[${index}].productId`}
          value={product.id}
        />
      ))}

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md
                 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting ? 'Creating Bundle...' : 'Create Bundle'}
      </motion.button>

      {actionData?.error && (
        <div className="mt-4 text-red-500 text-sm">{actionData.error}</div>
      )}
    </FormContainer>
  );
}
