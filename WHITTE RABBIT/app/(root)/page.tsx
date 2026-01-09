'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Smartphone } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  // Reemplazo del bloque problemático: usar un array en lugar de un objeto mal formado
  const steps = [
    { icon: '☕', title: 'Compra', desc: 'Elige tu café favorito del menú' },
    { icon: '🎯', title: 'Gana Puntos', desc: '1 punto por cada $100 COP' },
    { icon: '🎁', title: 'Canjea', desc: 'Productos gratis con tus puntos' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Hero */}
      <motion.section
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/50 via-black to-pink-900/50 border border-purple-500/30 p-12 md:p-20"
      >
        <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-200 via-purple-400 to-pink-500 bg-clip-text text-transparent leading-tight">
            Compra café, gana puntos y reclama productos GRATIS
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl font-light">
            1 Rabbit Point = $100 COP · Cada compra te acerca a premios increíbles 🐰
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 active:scale-95"
            >
              ☕ Ver Menú
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/puntos"
              className="inline-flex items-center gap-2 bg-purple-900/50 hover:bg-purple-900/70 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105 border border-purple-500/50"
            >
              🐰 Mis Puntos
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Cómo funciona */}
      <motion.section variants={itemVariants} className="grid md:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -5 }}
            className="group bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/20 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-all hover:bg-purple-900/40"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{step.icon}</div>
            <h3 className="font-bold text-lg mb-2">{step.title}</h3>
            <p className="text-gray-400 text-sm">{step.desc}</p>
          </motion.div>
        ))}
      </motion.section>

      {/* Ruleta */}
      <motion.section
        variants={itemVariants}
        className="bg-gradient-to-r from-amber-600/40 to-orange-600/40 border border-amber-500/30 rounded-2xl p-8 md:p-12 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">🎰 ¡Gira la ruleta!</h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
          Con compras mayores a <span className="font-bold">$30.000</span> accedes a premios sorpresa: descuentos, productos gratis y más
        </p>
        <Link
          href="/carrito"
          className="inline-block bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 px-8 py-3 rounded-xl font-bold transition-all hover:scale-105"
        >
          Ir al carrito
        </Link>
      </motion.section>

      {/* PWA */}
      <motion.section
        variants={itemVariants}
        className="bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8"
      >
        <Smartphone className="w-20 h-20 text-cyan-400 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-2xl font-bold mb-3">📲 Instala la app</h3>
          <p className="text-gray-300 mb-6">
            Acceso rápido a menú, carrito y tus puntos. Funciona sin conexión.
          </p>
          <button
            onClick={() => {
              const prompt = (window as any).deferredPrompt;
              if (prompt) {
                prompt.prompt();
              } else {
                alert('App disponible en navegadores compatibles');
              }
            }}
            className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
          >
            Descargar App
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}
