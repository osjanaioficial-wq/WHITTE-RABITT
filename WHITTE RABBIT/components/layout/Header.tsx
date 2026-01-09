'use client';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { useEffect, useState } from 'react';

export default function Header() {
  const { cart } = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-lg border-b border-purple-900/30">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-3xl group-hover:scale-110 transition-transform">🐰</span>
          <h1 className="hidden sm:block text-xl font-black bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            WHITTE RABBIT
          </h1>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/menu" className="hover:text-purple-400 transition">Menú</Link>
          <Link href="/puntos" className="hover:text-purple-400 transition">Puntos</Link>
          <Link href="/promociones" className="hover:text-purple-400 transition">Promociones</Link>
        </nav>

        <Link href="/carrito" className="relative p-2 hover:bg-purple-900/30 rounded-lg transition">
          <ShoppingCart size={24} />
          {mounted && cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-pink-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
