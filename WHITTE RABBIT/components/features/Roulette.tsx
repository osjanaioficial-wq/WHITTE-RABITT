'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const prizes = [
  '5% descuento',
  'Café gratis',
  '10% descuento',
  'Brownie gratis',
  '15% descuento',
  'Chocolate gratis',
];

export default function Roulette({ total }: { total: number }) {
  const [spinning, setSpinning] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  const handleSpin = async () => {
    if (spinning) return;

    setSpinning(true);
    const randomIndex = Math.floor(Math.random() * prizes.length);
    const newRotation = rotation + 360 * 3 + randomIndex * (360 / prizes.length);
    setRotation(newRotation);

    setTimeout(() => {
      setSelectedPrize(prizes[randomIndex]);
      setSpinning(false);
    }, 3000);
  };

  return (
    <div className="bg-gradient-to-br from-yellow-900/40 to-orange-900/40 border border-yellow-500/30 rounded-2xl p-8 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">🎰 ¡Gira la ruleta!</h3>
        <p className="text-gray-400">Tu compra califica para un premio sorpresa</p>
      </div>

      {/* Ruleta */}
      <div className="flex justify-center">
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: 'easeOut' }}
          className="relative w-48 h-48"
        >
          <div className="absolute inset-0 rounded-full border-8 border-yellow-500 bg-gradient-conic from-yellow-600 via-orange-600 to-yellow-600 flex items-center justify-center">
            <div className="absolute inset-2 rounded-full bg-black border-4 border-yellow-500 flex items-center justify-center">
              <span className="text-3xl">🐰</span>
            </div>
            {prizes.map((prize, i) => {
              const angle = (i / prizes.length) * 360;
              return (
                <div
                  key={i}
                  className="absolute text-xs font-bold text-white px-2 py-1 bg-black/50 rounded"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-60px) rotate(-${angle}deg)`,
                  }}
                >
                  {prize}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Aguja */}
      <div className="flex justify-center">
        <div className="text-4xl animate-pulse">↓</div>
      </div>

      {selectedPrize && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-green-900/30 border border-green-500/50 rounded-lg p-4"
        >
          <p className="text-lg font-bold text-green-400">🎉 ¡Has ganado!</p>
          <p className="text-2xl font-black text-green-300">{selectedPrize}</p>
        </motion.div>
      )}

      <button
        onClick={handleSpin}
        disabled={spinning}
        className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:opacity-50 px-8 py-3 rounded-lg font-bold transition-all"
      >
        {spinning ? 'Girando...' : '🎪 Girar ruleta'}
      </button>
    </div>
  );
}
