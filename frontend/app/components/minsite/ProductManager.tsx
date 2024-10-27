import { useState } from "react";
import { motion } from "framer-motion";
import { useFetcher } from "@remix-run/react";
import type { Product } from "~/types/models";

interface ProductManagerProps {
  products: Product[];
  onProductsChange: (products: Product[]) => void;
  minsiteId: string;
}

export function ProductManager({ products, onProductsChange, minsiteId }: ProductManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const fetcher = useFetcher();

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      fetcher.submit(
        {
          ...newProduct,
          minsiteId,
          intent: "addProduct"
        },
        { method: "post", action: "/api/products" }
      );
      setNewProduct({});
      setIsAdding(false);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    fetcher.submit(
      { productId, minsiteId, intent: "removeProduct" },
      { method: "delete", action: "/api/products" }
    );
  };

  return (
    <div className="product-manager space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Products</h3>
        <button
          onClick={() => setIsAdding(true)}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Product
        </button>
      </div>

      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 p-4 bg-gray-50 rounded-lg"
        >
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.name || ""}
            onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price || ""}
            onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={newProduct.description || ""}
            onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAdding(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddProduct}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={fetcher.state === "submitting"}
            >
              {fetcher.state === "submitting" ? "Adding..." : "Add"}
            </button>
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {products.map(product => (
          <motion.div
            key={product.id}
            layout
            className="p-4 bg-white rounded-lg shadow"
          >
            <div className="flex justify-between">
              <h4 className="font-medium">{product.name}</h4>
              <button
                onClick={() => handleRemoveProduct(product.id)}
                className="text-red-500 hover:text-red-600"
                disabled={fetcher.state === "submitting"}
              >
                Remove
              </button>
            </div>
            <p className="text-gray-600 text-sm mt-1">{product.description}</p>
            <p className="text-lg font-bold mt-2">${product.price.toFixed(2)}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
