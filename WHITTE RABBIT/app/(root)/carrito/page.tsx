'use client';
import { useAppStore } from '@/lib/store';
import { Trash2, Plus, Minus } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Roulette from '@/components/features/Roulette';
import { useState } from 'react';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, clearCart, cartTotal } = useAppStore();
  const [loading, setLoading] = useState(false);

  const total = cartTotal();
  const points = Math.floor(total / 100);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    setLoading(true);
    try {
      // Enviar a WhatsApp
      const items = cart
        .map((item) => `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toLocaleString('es-CO')}`)
        .join('\n');
      const message = encodeURIComponent(
        `Pedido Whitte Rabbit Café:\n${items}\n\nTotal: $${total.toLocaleString('es-CO')}\nPuntos: +${points}`
      );
      window.open(`https://wa.me/573144002720?text=${message}`);

      // Aquí guardarías el pedido en BD
      clearCart();
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-4">Carrito vacío</h2>
        <p className="text-gray-400 mb-8">Agrega productos para continuar</p>
        <Link
          href="/menu"
          className="inline-block bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-bold transition-all"
        >
          Ver menú
        </Link>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
        🛒 Tu Carrito
      </h1>

      {/* Items */}
      <div className="space-y-4">
        {cart.map((item) => (
          <motion.div
            key={item.productId}
            layout
            className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex-1">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-sm text-gray-400">
                ${item.price.toLocaleString('es-CO')} c/u
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                className="bg-purple-900/50 hover:bg-purple-900 p-2 rounded transition"
              >
                <Minus size={16} />
              </button>
              <span className="font-bold min-w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                className="bg-purple-900/50 hover:bg-purple-900 p-2 rounded transition"
              >
                <Plus size={16} />
              </button>
              <button
                onClick={() => removeFromCart(item.productId)}
                className="bg-red-900/50 hover:bg-red-900 p-2 rounded transition ml-2"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resumen */}
      <div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/20 rounded-xl p-6 space-y-4">
        <div className="flex justify-between text-lg">
          <span>Subtotal:</span>
          <span>${total.toLocaleString('es-CO')}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-purple-300">
          <span>🐰 Puntos ganados:</span>
          <span>+{points} pts</span>
        </div>
        <div className="border-t border-purple-500/20 pt-4 flex justify-between text-2xl font-black">
          <span>Total:</span>
          <span className="text-purple-300">${total.toLocaleString('es-CO')}</span>
        </div>
      </div>

      {/* Ruleta */}
      {total >= 30000 && <Roulette total={total} />}

      {/* Botones */}
      <div className="flex gap-4">
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-4 rounded-lg font-bold transition-all disabled:opacity-50"
        >
          {loading ? 'Enviando...' : '📱 Enviar por WhatsApp'}
        </button>
        <Link
          href="/menu"
          className="px-6 py-4 border border-purple-500/50 rounded-lg font-bold hover:bg-purple-900/30 transition"
        >
          Continuar comprando
        </Link>
      </div>
    </motion.div>
  );
}
