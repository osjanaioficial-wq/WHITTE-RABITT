// SPA minimal: rutas: #/, #/menu, #/carrito, #/puntos, #/perfil
const API = (path, opts) => fetch(path, { headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', ...(opts || {}) }).then(r => r.json().catch(()=>({})));

const app = document.getElementById('app');
const cartBadge = document.getElementById('cart-badge');

function getCart() { return JSON.parse(localStorage.getItem('wr_cart') || '[]'); }
function saveCart(c) { localStorage.setItem('wr_cart', JSON.stringify(c)); updateCartBadge(); }
function updateCartBadge(){ const total = getCart().reduce((s,i)=>s+i.qty,0); cartBadge.textContent = total; }

// Formatea moneda en COP
function fCOP(n){ return 'COP ' + n.toLocaleString('es-CO'); }

// RENDER: Home
function renderHome(){
  app.innerHTML = `
    <section>
      <div style="padding:18px;background:linear-gradient(90deg,var(--glass),transparent);border-radius:12px;margin-bottom:12px;">
        <h2 style="color:var(--accent)">Compra café, gana puntos y reclama productos GRATIS</h2>
        <p class="small">Móvil · Diseño oscuro · Ruleta activa sobre $30.000</p>
        <div style="margin-top:12px;">
          <a href="#/menu" class="btn">Ver menú</a>
        </div>
      </div>
      <div id="home-feature" class="cards"></div>
    </section>
  `;
  const hf = document.getElementById('home-feature');
  hf.innerHTML = ''; // cards: ejemplo de items destacados (fetch reales)
  API('/api/productos').then(list=>{
    (list.slice(0,3)).forEach(p=>{
      const el = document.createElement('div');
      el.className = 'card';
      el.innerHTML = `<div class="info"><div class="title">${p.nombre}</div><div class="price small">${fCOP(p.precio)}</div></div>
        <div>
          <button class="btn" data-id="${p.id}">Agregar</button>
        </div>`;
      el.querySelector('button').addEventListener('click', ()=> addToCart(p));
      hf.appendChild(el);
    });
  });
}

// RENDER: Menu
function renderMenu(){
  app.innerHTML = `<section><h2 style="margin-bottom:12px">Menú</h2><div id="menu-list" class="cards"></div></section>`;
  const ml = document.getElementById('menu-list');
  API('/api/productos').then(list=>{
    if (!list.length) return ml.innerHTML = '<div class="center">No hay productos</div>';
    list.forEach(p=>{
      const el = document.createElement('div');
      el.className = 'card';
      el.innerHTML = `<div class="info"><div class="title">${p.nombre}</div><div class="price">${fCOP(p.precio)}</div></div>
        <div style="display:flex;flex-direction:column;gap:8px;"><button class="btn" data-id="${p.id}">Agregar</button><div class="small">1 punto = $100 COP</div></div>`;
      el.querySelector('button').addEventListener('click', ()=> addToCart(p));
      ml.appendChild(el);
    });
  });
}

// Añadir al carrito
function addToCart(p){
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === p.id);
  if (idx>=0) { cart[idx].qty++; } else cart.push({ id: p.id, nombre: p.nombre, precio: p.precio, qty: 1 });
  saveCart(cart);
  showToast('Añadido al carrito');
}

// RENDER: Carrito
function renderCart(){
  const cart = getCart();
  const total = cart.reduce((s,i)=>s+i.precio*i.qty,0);
  const puntos = Math.floor(total/100);
  app.innerHTML = `
    <section>
      <h2>Carrito</h2>
      <div class="cart-list">
        ${cart.map(item=>`<div class="cart-item"><div><strong>${item.nombre}</strong><div class="small">${fCOP(item.precio)} · x${item.qty}</div></div>
        <div style="display:flex;gap:8px;align-items:center;">
          <button class="btn secondary" data-action="dec" data-id="${item.id}">-</button>
          <button class="btn secondary" data-action="inc" data-id="${item.id}">+</button>
        </div></div>`).join('') || '<div class="center">Tu carrito está vacío</div>'}
      </div>
      <div class="kv"><div>Total</div><div>${fCOP(total)}</div></div>
      <div class="kv"><div>Puntos ganados</div><div>${puntos}</div></div>
      <div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">
        <button id="btn-whatsapp" class="btn">${total>0? 'Enviar por WhatsApp' : 'Agregar productos'}</button>
        <button id="btn-order" class="btn secondary">Realizar pedido</button>
      </div>
      <div style="margin-top:12px" id="ruleta-area"></div>
    </section>
  `;
  // controls
  document.querySelectorAll('[data-action]').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const id = Number(btn.dataset.id);
      const action = btn.dataset.action;
      modifyQty(id, action === 'inc' ? 1 : -1);
      renderCart();
    });
  });
  document.getElementById('btn-whatsapp').addEventListener('click', ()=>{
    if (total === 0) return showToast('Agrega productos');
    const lines = cart.map(i=>`${i.qty}x ${i.nombre} (${fCOP(i.precio)})`);
    const msg = encodeURIComponent(`Pedido WHITTE RABBIT CAFÉ\n${lines.join('\n')}\nTotal: ${fCOP(total)}\nPago: ___`);
    window.open(`https://wa.me/573144002720?text=${msg}`, '_blank');
  });
  document.getElementById('btn-order').addEventListener('click', ()=> {
    if (total === 0) return showToast('Carrito vacío');
    API('/api/pedido', { method: 'POST', body: JSON.stringify({ detalle: cart, total }) })
      .then(res => {
        if (res && res.id) {
          saveCart([]); renderCart(); showToast(`Pedido guardado. Puntos: +${res.puntosGanados}`);
        } else showToast('Error al guardar pedido');
      });
  });

  // Ruleta
  const ruletaArea = document.getElementById('ruleta-area');
  if (total >= 30000) {
    ruletaArea.innerHTML = `<div class="ruleta"><button id="spin" class="btn pulse">Girar ruleta 🎉</button><div class="small">¿Suerte?</div></div><div id="spin-result" class="center small"></div>`;
    document.getElementById('spin').addEventListener('click', ()=>{
      document.getElementById('spin').disabled = true;
      API('/api/ruleta', { method: 'POST', body: JSON.stringify({ total }) }).then(r=>{
        document.getElementById('spin-result').textContent = r.premio ? `¡Has ganado: ${r.premio}` : 'Error al girar';
      });
    });
  } else {
    ruletaArea.innerHTML = `<div class="small">Ruleta disponible para pedidos desde ${fCOP(30000)}</div>`;
  }
}

function modifyQty(id, delta){
  let cart = getCart();
  const idx = cart.findIndex(i=>i.id===id);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx,1);
  saveCart(cart);
}

// RENDER: Puntos
function renderPuntos(){
  app.innerHTML = `<section><h2>Puntos</h2><div id="puntos-box" class="card center">Cargando...</div></section>`;
  API('/api/puntos').then(r=>{
    const box = document.getElementById('puntos-box');
    box.innerHTML = `<div style="font-size:22px;font-weight:700;color:var(--accent)">${r.total_puntos || 0} pts</div>
      <div class="small">1 punto = $100 COP</div>`;
  });
}

// RENDER: Perfil y Admin
function renderPerfil(){
  app.innerHTML = `<section><h2>Perfil</h2><div id="perfil-area" class="card"><div id="perfil-inner">Cargando...</div></div></section>`;
  API('/api/admin/status').then(r=>{
    const inner = document.getElementById('perfil-inner');
    if (r.admin) renderAdminPanel(inner);
    else {
      inner.innerHTML = `<form id="admin-login" style="display:flex;flex-direction:column;gap:8px">
        <input name="username" placeholder="Usuario" />
        <input name="password" type="password" placeholder="Contraseña" />
        <div style="display:flex;gap:8px"><button class="btn">Login admin</button></div>
      </form>
      <div class="small" style="margin-top:8px">Credenciales: WRCAFE / wrcafe</div>`;
      document.getElementById('admin-login').addEventListener('submit', e=>{
        e.preventDefault();
        const f = e.target;
        const data = { username: f.username.value, password: f.password.value };
        API('/api/admin/login', { method: 'POST', body: JSON.stringify(data) }).then(res=>{
          if (res.ok) { showToast('Admin activo'); renderPerfil(); } else showToast('Credenciales inválidas');
        });
      });
    }
  });
}

function renderAdminPanel(container){
  container.innerHTML = `<div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <strong>Panel Admin</strong>
      <button id="btn-refresh" class="btn secondary">Refrescar</button>
    </div>
    <form id="new-product" style="display:flex;gap:8px;flex-wrap:wrap">
      <input name="nombre" placeholder="Nombre producto" />
      <input name="precio" placeholder="Precio" type="number" />
      <button class="btn">Crear</button>
    </form>
    <div id="admin-list" class="cards"></div>
  </div>`;
  loadAdminProducts();
  document.getElementById('btn-refresh').addEventListener('click', loadAdminProducts);
  document.getElementById('new-product').addEventListener('submit', e=>{
    e.preventDefault();
    const fd = e.target;
    API('/api/productos', { method: 'POST', body: JSON.stringify({ nombre: fd.nombre.value, precio: Number(fd.precio.value) }) })
      .then(r => { showToast('Producto creado'); loadAdminProducts(); fd.reset(); });
  });
}

function loadAdminProducts(){
  API('/api/productos').then(list=>{
    const wrap = document.getElementById('admin-list');
    wrap.innerHTML = '';
    list.forEach(p=>{
      const el = document.createElement('div');
      el.className = 'card';
      el.innerHTML = `<div class="info"><input value="${p.nombre}" data-id="${p.id}" class="small" /><div class="small">${fCOP(p.precio)}</div></div>
        <div style="display:flex;flex-direction:column;gap:8px">
          <button class="btn" data-edit="${p.id}">Guardar</button>
          <button class="btn secondary" data-del="${p.id}">Desactivar</button>
        </div>`;
      el.querySelector('[data-edit]').addEventListener('click', ()=>{
        const nombre = el.querySelector('input').value;
        API(`/api/productos/${p.id}`, { method: 'PUT', body: JSON.stringify({ nombre }) }).then(()=>{ showToast('Guardado'); loadAdminProducts(); });
      });
      el.querySelector('[data-del]').addEventListener('click', ()=>{
        if (!confirm('Desactivar producto?')) return;
        API(`/api/productos/${p.id}`, { method: 'DELETE' }).then(()=>{ showToast('Producto desactivado'); loadAdminProducts(); });
      });
      wrap.appendChild(el);
    });
  });
}

// Util: toast sencillo
let toastTimer;
function showToast(txt){
  let t = document.getElementById('wr-toast');
  if (!t) { t = document.createElement('div'); t.id = 'wr-toast'; t.style = 'position:fixed;left:50%;transform:translateX(-50%);bottom:20px;background:#111;padding:10px 14px;border-radius:10px;box-shadow:0 6px 20px rgba(0,0,0,0.6);z-index:999;color:var(--accent);'; document.body.appendChild(t); }
  t.textContent = txt;
  t.style.opacity = 1;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>{ t.style.opacity = 0; }, 2500);
}

// Router
function router(){
  updateCartBadge();
  const hash = location.hash || '#/';
  if (hash.startsWith('#/menu')) renderMenu();
  else if (hash.startsWith('#/carrito')) renderCart();
  else if (hash.startsWith('#/puntos')) renderPuntos();
  else if (hash.startsWith('#/perfil')) renderPerfil();
  else renderHome();
}
window.addEventListener('hashchange', router);
window.addEventListener('load', ()=>{ updateCartBadge(); router(); });
