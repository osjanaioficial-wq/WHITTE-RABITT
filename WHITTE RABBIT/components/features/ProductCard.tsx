'use client';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';
import { Plus } from 'lucide-react';

interface ProductProps {
  product: {
    id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
  };
}

export default function ProductCard({ product }: ProductProps) {
  const { addToCart } = useAppStore();

  const points = Math.floor(product.price / 100);

  const handleAddCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
    // Toast notification aquí
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-xl overflow-hidden group cursor-pointer hover:border-purple-500/50 transition-all"
    >
      <Link href={`/producto/${product.id}`} className="block p-4">
        {product.image && (
          <div className="w-full h-40 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg mb-4 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
            />
          </div>
        )}
        <h3 className="font-bold text-lg group-hover:text-purple-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 mt-2">
          {product.description}
        </p>
      </Link>

      <div className="px-4 pb-4 border-t border-purple-500/10 pt-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-black text-purple-300">
            ${product.price.toLocaleString('es-CO')}
          </span>
          <span className="text-xs bg-purple-500/30 text-purple-200 px-2 py-1 rounded">
            🐰 +{points} pts
          </span>
        </div>
        <button
          onClick={handleAddCart}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
        >
          <Plus size={18} />
          Agregar
        </button>
      </div>
    </motion.div>
  );
}
