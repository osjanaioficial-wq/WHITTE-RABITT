'use client';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminButton() {
  const { isAdmin, setIsAdmin } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = () => {
    if (password.toLowerCase() === 'wrcafe') {
      setIsAdmin(true);
      setShowModal(false);
      setPassword('');
      setError('');
      localStorage.setItem('wr_admin', 'true');
    } else {
      setError('❌ Contraseña incorrecta');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('wr_admin');
  };

  if (!mounted) return null;

  return (
    <>
      {/* Botón flotante */}
      <AnimatePresence>
        {!isAdmin && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all z-40"
            title="Admin panel"
          >
            <Settings size={24} />
          </motion.button>
        )}

        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-6 right-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-3 z-40 font-medium"
          >
            <span className="w-3 h-3 bg-white rounded-full animate-pulse" />
            Admin: ON
            <button
              onClick={handleLogout}
              className="ml-2 text-sm underline hover:no-underline bg-black/30 px-2 py-1 rounded transition"
            >
              Salir
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal login */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-purple-900 to-black border-2 border-purple-500 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl"
            >
              <h2 className="text-2xl font-black mb-6 text-center">🔐 Admin Login</h2>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Contraseña admin"
                autoFocus
                className="w-full bg-black/50 border-2 border-purple-500 rounded-lg px-4 py-3 text-white mb-4 focus:outline-none focus:border-purple-300 transition"
              />
              {error && <p className="text-red-400 text-sm mb-4 text-center font-medium">{error}</p>}
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-bold transition-all hover:scale-105 active:scale-95"
              >
                Ingresar
              </button>
              <p className="text-gray-400 text-xs text-center mt-4">
                Pista: Contraseña = nombre del café
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
