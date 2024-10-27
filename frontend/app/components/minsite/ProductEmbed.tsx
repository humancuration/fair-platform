import { motion } from "framer-motion";
import type { Product } from "~/types/minsite";
import { useFetcher } from "@remix-run/react";
import { FaShoppingCart } from "react-icons/fa";

interface ProductEmbedProps {
  product: Product;
  layout?: "grid" | "list" | "featured";
  showDescription?: boolean;
}

export function ProductEmbed({ 
  product, 
  layout = "grid",
  showDescription = true 
}: ProductEmbedProps) {
  const fetcher = useFetcher();

  const handleAddToCart = () => {
    fetcher.submit(
      { productId: product.id },
      { method: "post", action: "/api/cart/add" }
    );
  };

  return (
    <motion.div
      className={`product-embed ${layout} bg-white rounded-lg shadow-md overflow-hidden`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* Rest of the component remains the same */}
    </motion.div>
  );
}
