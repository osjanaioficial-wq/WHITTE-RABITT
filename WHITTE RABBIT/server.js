const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const DB_PATH = path.join(__dirname, 'database.sqlite');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'wr-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // no https for local dev
}));

// Inicializar DB y tablas si no existen
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) return console.error('DB ERROR', err);
  console.log('Conectado a SQLite en', DB_PATH);
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio INTEGER NOT NULL,
    activo INTEGER DEFAULT 1
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    detalle TEXT NOT NULL,
    total INTEGER NOT NULL,
    fecha TEXT NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS puntos (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    total_puntos INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS premios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    descripcion TEXT NOT NULL,
    fecha TEXT NOT NULL
  )`);

  // Asegurar fila unica de puntos
  db.get('SELECT COUNT(*) as c FROM puntos', (err, row) => {
    if (err) return console.error(err);
    if (row.c === 0) {
      db.run('INSERT INTO puntos(id, total_puntos) VALUES (1, 0)');
    }
  });

  // Insertar algunos productos por defecto si tabla vacía
  db.get('SELECT COUNT(*) as c FROM productos', (err, row) => {
    if (err) return console.error(err);
    if (row.c === 0) {
      const stmt = db.prepare('INSERT INTO productos(nombre, precio, activo) VALUES (?,?,1)');
      const defaults = [
        ['Espresso', 3000],
        ['Cappuccino', 4500],
        ['Latte', 4800],
        ['Cold Brew', 6000],
        ['Brownie', 3500]
      ];
      defaults.forEach(p => stmt.run(p[0], p[1]));
      stmt.finalize();
    }
  });
});

// Middleware helper: require admin
function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.status(403).json({ error: 'Admin requerido' });
}

// Rutas API

// Productos
app.get('/api/productos', (req, res) => {
  db.all('SELECT * FROM productos WHERE activo = 1', (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error BD' });
    res.json(rows);
  });
});

app.post('/api/productos', requireAdmin, (req, res) => {
  const { nombre, precio } = req.body;
  if (!nombre || !precio) return res.status(400).json({ error: 'Datos incompletos' });
  db.run('INSERT INTO productos(nombre, precio, activo) VALUES (?,?,1)', [nombre, precio], function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo crear' });
    res.json({ id: this.lastID, nombre, precio, activo: 1 });
  });
});

app.put('/api/productos/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const { nombre, precio, activo } = req.body;
  db.run('UPDATE productos SET nombre = COALESCE(?, nombre), precio = COALESCE(?, precio), activo = COALESCE(?, activo) WHERE id = ?', [nombre, precio, activo, id], function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo actualizar' });
    res.json({ ok: true });
  });
});

app.delete('/api/productos/:id', requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  // desactivar en vez de eliminar para mantener historial
  db.run('UPDATE productos SET activo = 0 WHERE id = ?', [id], function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo desactivar' });
    res.json({ ok: true });
  });
});

// Pedido: guarda en BD y suma puntos
app.post('/api/pedido', (req, res) => {
  const { detalle, total } = req.body;
  if (!detalle || typeof total !== 'number') return res.status(400).json({ error: 'Datos inválidos' });
  const fecha = new Date().toISOString();
  db.run('INSERT INTO pedidos(detalle, total, fecha) VALUES (?,?,?)', [JSON.stringify(detalle), total, fecha], function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo guardar pedido' });
    // sumar puntos: 1 punto por cada $100 COP
    const puntosGanados = Math.floor(total / 100);
    db.run('UPDATE puntos SET total_puntos = total_puntos + ? WHERE id = 1', [puntosGanados], (err) => {
      if (err) console.error('Error actualizando puntos', err);
      return res.json({ id: this.lastID, puntosGanados });
    });
  });
});

// Obtener puntos
app.get('/api/puntos', (req, res) => {
  db.get('SELECT total_puntos FROM puntos WHERE id = 1', (err, row) => {
    if (err) return res.status(500).json({ error: 'Error BD' });
    res.json({ total_puntos: row ? row.total_puntos : 0 });
  });
});

// Ruleta: activa si total >= 30000
app.post('/api/ruleta', (req, res) => {
  const { total } = req.body;
  if (typeof total !== 'number') return res.status(400).json({ error: 'Total inválido' });
  if (total < 30000) return res.status(400).json({ error: 'No alcanza el mínimo para ruleta' });

  const premios = [
    'Chocolate gratis',
    '5% descuento en próxima compra',
    'Café pequeño gratis',
    '10% descuento',
    'Brownie gratis'
  ];
  const prize = premios[Math.floor(Math.random() * premios.length)];
  const fecha = new Date().toISOString();
  db.run('INSERT INTO premios(descripcion, fecha) VALUES (?, ?)', [prize, fecha], function(err) {
    if (err) return res.status(500).json({ error: 'No se pudo guardar premio' });
    res.json({ premio: prize });
  });
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Credenciales incompletas' });
  // Credenciales fijas WRCAFE / wrcafe (case-insensitive)
  if (username.toUpperCase() === 'WRCAFE' && password === 'wrcafe') {
    req.session.isAdmin = true;
    return res.json({ ok: true });
  }
  return res.status(401).json({ error: 'Credenciales inválidas' });
});

// Estado admin
app.get('/api/admin/status', (req, res) => {
  res.json({ admin: !!(req.session && req.session.isAdmin) });
});

// Puerto
app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
  console.log('Correr: npm install && node server.js');
});
