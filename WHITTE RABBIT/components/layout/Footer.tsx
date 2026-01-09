'use client';

export default function Footer() {
  return (
    <footer className="bg-black/50 border-t border-purple-900/30 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-lg mb-4">⏰ Horarios</h4>
            <p className="text-gray-400 text-sm space-y-1">
              <div>Lun–Vie: 8AM–8PM</div>
              <div>Sáb: 9AM–8PM</div>
              <div>Dom: 2PM–9PM</div>
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">📍 Ubicación</h4>
            <p className="text-gray-400 text-sm">
              El Nepal<br />
              Cra 6a #15-09<br />
              Chinchiná, Caldas
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">📞 Contacto</h4>
            <p className="text-gray-400 text-sm">
              <a href="https://wa.me/573144002720" target="_blank" className="hover:text-green-400 transition">
                WhatsApp: +57 314 400 2720
              </a>
            </p>
          </div>
        </div>

        <div className="border-t border-purple-900/30 pt-8 text-center text-gray-500 text-sm space-y-2">
          <p>🐰 Nacido en 2025 por una idea de Walter</p>
          <p>Con apoyo de Z.AI y Oskitar</p>
          <p className="text-xs mt-4">© 2025 Whitte Rabbit Café. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
