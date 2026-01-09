'use client';
import { useEffect, useState } from 'react';
import ProductCard from '@/components/features/ProductCard';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  category: { name: string };
}

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    // Fetch productos
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        const cats = [...new Set(data.map((p: Product) => p.category.name))];
        setCategories(cats);
        if (cats.length) setActiveCategory(cats[0]);
      });
  }, []);

  const filtered =
    activeCategory === ''
      ? products
      : products.filter((p) => p.category.name === activeCategory);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
        ☕ Menú
      </h1>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveCategory('')}
          className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
            activeCategory === ''
              ? 'bg-purple-600 text-white'
              : 'bg-purple-900/30 text-gray-400 hover:bg-purple-900/50'
          }`}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-purple-600 text-white'
                : 'bg-purple-900/30 text-gray-400 hover:bg-purple-900/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </div>
  );
}
