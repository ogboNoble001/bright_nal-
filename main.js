'use strict';

const SERVER_URL = 'https://brightnal.onrender.com';

let cart = [];

const fmt = n => '&#8358;' + n.toLocaleString('en-NG');
const $   = id => document.getElementById(id);

/* ---- Inline SVG snippets ---- */
const SVG = {
  bookmark: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>`,
  eye: `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  shoppingBag: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
};

/* ---- Product data — also exposed on window so drawer.js can read it ---- */
let PRODS = [];
window.PRODS = PRODS;
let currentFilter = 'all';

/* ---- Loading skeleton ---- */
function showSkeleton() {
  $('prodGrid').innerHTML = Array(8).fill(0).map(() => `
    <div class="pc pc-skeleton">
      <div class="skel skel-img"></div>
      <div class="pc-body">
        <div class="skel skel-line" style="width:40%;height:12px;margin-bottom:8px"></div>
        <div class="skel skel-line" style="width:80%;height:14px;margin-bottom:8px"></div>
        <div class="skel skel-line" style="width:55%;height:13px;margin-bottom:12px"></div>
        <div class="skel skel-btn"></div>
      </div>
    </div>
  `).join('');
}

/* ---- Map backend fields ---- */
function mapProduct(p) {
  return {
    id:          p.id,
    name:        p.product_name,
    cat:         p.category,
    f:           (p.category || 'all').toLowerCase().trim(),
    price:       parseFloat(p.price),
    orig:        null,
    badge:       null,
    img:         p.image_url,
    description: p.description || '',
    sizes:       p.sizes || '',
    colors:      p.colors || '',
    stock:       p.stock || 0,
  };
}

/* ---- Fetch from backend ---- */
async function fetchProducts() {
  showSkeleton();
  try {
    const res = await fetch(`${SERVER_URL}/api/products/all`);
    const data = await res.json();
    
    if (!data.success) { showGridError('Failed to load products. Please try again.'); return; }
    
    PRODS = data.products.map(mapProduct);
    window.PRODS = PRODS;
    
    console.log([...new Set(PRODS.map(p => p.f))]); // ← remove after debugging
    
    if (!PRODS.length) {
      $('prodGrid').innerHTML = `<p class="prod-empty">No products available yet.</p>`;
      return;
    }
    
    renderProds(currentFilter);
  } catch (err) {
    console.error(err);
    showGridError('Could not connect. Check your connection.');
  }
}

function showGridError(msg) {
  $('prodGrid').innerHTML = `
    <div class="prod-error">
      <p>${msg}</p>
      <button onclick="fetchProducts()">Try again</button>
    </div>
  `;
}

/* ---- Product grid ---- */
function renderProds(f = 'all') {
  currentFilter = f;
  const list = f === 'all' ? PRODS : PRODS.filter(p => p.f === f);

  if (!list.length) {
    $('prodGrid').innerHTML = `<p class="prod-empty">No products in this category yet.</p>`;
    removeSeeMore();
    return;
  }

  $('prodGrid').innerHTML = list.map(p => `
    <div class="pc">
      <div class="pc-img" onclick="openQuickView(${p.id})" style="cursor:pointer;">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        ${p.badge ? `<span class="pc-badge b-${p.badge}">${p.badge === 'new' ? 'New' : p.badge === 'sale' ? 'Sale' : 'Limited'}</span>` : ''}
        <div class="pc-acts">
          <button class="pc-ab" onclick="event.stopPropagation();doWish(${p.id})" title="Save">${SVG.bookmark}</button>
          <button class="pc-ab" onclick="event.stopPropagation();doQv(${p.id})"   title="Quick view">${SVG.eye}</button>
        </div>
      </div>
      <div class="pc-body">
        <div class="pc-cat">${p.cat}</div>
        <div class="pc-name">${p.name}</div>
        <div class="pc-pr">
          <span class="pc-price">${fmt(p.price)}</span>
          ${p.orig ? `<span class="pc-orig">${fmt(p.orig)}</span>` : ''}
        </div>
        <div class="pc-ft">
          <button class="pc-add" onclick="addCart(${p.id})">Add to Bag</button>
        </div>
      </div>
    </div>
  `).join('');

  renderSeeMore(list.length);
}

/* ---- Quick-view drawer ---- */
function openQuickView(id) {
  const p = PRODS.find(x => x.id === id);
  if (!p) return;
  if (typeof window.openProductDrawer === 'function') {
    window.openProductDrawer(p.id);
  }
}
window.openQuickView = openQuickView;

/* ---- See More button ---- */
function renderSeeMore(count) {
  removeSeeMore();
  const section = document.getElementById('products');
  if (!section) return;

  const wrap = document.createElement('div');
  wrap.id = 'seeMoreWrap';
  wrap.style.cssText = 'display:flex;justify-content:center;margin-top:2.5rem;';

  wrap.innerHTML = `
    <button id="seeMoreBtn" onclick="openSearchWithAll()" style="
      display:inline-flex;align-items:center;gap:.6rem;
      background:none;
      border:1px solid var(--border-b);
      color:var(--ts);
      padding:.85rem 2.2rem;
      border-radius:var(--rp);
      font-family:var(--fb);
      font-size:.82rem;
      font-weight:600;
      letter-spacing:.08em;
      text-transform:uppercase;
      cursor:pointer;
      transition:all .2s;
    "
    onmouseover="this.style.background='var(--tp)';this.style.color='var(--surface)';this.style.borderColor='var(--tp)';"
    onmouseout="this.style.background='none';this.style.color='var(--ts)';this.style.borderColor='var(--border-b)';"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
      See all pieces
    </button>
  `;

  section.appendChild(wrap);
}

function removeSeeMore() {
  const existing = document.getElementById('seeMoreWrap');
  if (existing) existing.remove();
}

function openSearchWithAll() {
  if (typeof window.openSearch === 'function') window.openSearch();
}
window.openSearchWithAll = openSearchWithAll;

/* ---- Hero collection card click — opens search with tag ---- */
document.querySelectorAll('.hero-ic').forEach(function (card) {
  card.style.cursor = 'pointer';
  card.addEventListener('click', function () {
    const lbl = card.querySelector('.hero-ic-lbl');
    const tag = lbl ? lbl.textContent.trim() : '';
    if (tag && typeof window.searchFor === 'function') {
      window.openSearch();
      // slight delay so drawer is open and input is focused before we set the value
      setTimeout(function () {
        window.searchFor(tag);
      }, 120);
    }
  });
});

/* ---- Cart ---- */
function addCart(id) {
  const p = PRODS.find(x => x.id === id);
  if (!p) return;
  const e = cart.find(x => x.id === id);
  if (e) e.qty++;
  else cart.push({ ...p, qty: 1 });
  updCart();
  showToast(`Added: ${p.name}`);
}

function rmCart(id) {
  cart = cart.filter(x => x.id !== id);
  updCart();
}

function updCart() {
  const tot = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cnt = cart.reduce((s, i) => s + i.qty, 0);

  const b = $('cartCount');
  b.textContent = cnt;
  b.style.display = cnt > 0 ? 'flex' : 'none';

  $('cpTotal').innerHTML = fmt(tot);
  $('cpSub').textContent = cnt > 0 ? `\u00B7 ${cnt} item${cnt > 1 ? 's' : ''}` : '';

  const body = $('cpBody');
  if (!cart.length) {
    body.innerHTML = `
      <div class="cp-empty">
        <div class="cp-empty-ic">${SVG.shoppingBag}</div>
        <div class="cp-empty-t">Your bag is empty</div>
        <div class="cp-empty-s">Browse our collections and add pieces you love.</div>
      </div>`;
  } else {
    body.innerHTML = cart.map(i => `
      <div class="ci">
        <div class="ci-img"><img src="${i.img}" alt="${i.name}"/></div>
        <div class="ci-info">
          <div class="ci-name">${i.name}</div>
          <div class="ci-cat">${i.cat} &middot; Qty ${i.qty}</div>
          <div class="ci-row">
            <span class="ci-price">${fmt(i.price * i.qty)}</span>
            <button class="ci-rm" onclick="rmCart(${i.id})">Remove</button>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function doCheckout() {
  if (!cart.length) { showToast('Your bag is empty'); return; }
  showToast('Order placed \u2014 thank you!');
  cart = [];
  updCart();
  toggleCart();
}

function toggleCart() {
  const o = $('cp').classList.toggle('open');
  $('cv').classList.toggle('open');
  document.body.style.overflow = o ? 'hidden' : '';
}

function doWish(id) {
  const p = PRODS.find(x => x.id === id);
  if (p) showToast(`Saved: ${p.name}`);
}

function doQv(id) {
  if (typeof window.openProductDrawer === 'function') {
    window.openProductDrawer(id);
  }
}

/* ---- Toast ---- */
let tT;
function showToast(msg) {
  $('toastMsg').textContent = msg;
  $('toast').classList.add('show');
  clearTimeout(tT);
  tT = setTimeout(() => $('toast').classList.remove('show'), 2800);
}

/* ---- Nav scroll ---- */
window.addEventListener('scroll', () => {
  $('nav').classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---- Mobile drawer ---- */
function openDrw() {
  $('drw').classList.add('open');
  $('dbg').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeDrw() {
  $('drw').classList.remove('open');
  $('dbg').classList.remove('open');
  document.body.style.overflow = '';
}
$('ham').addEventListener('click', openDrw);

document.querySelectorAll('.filt-btn').forEach(b => {
  b.addEventListener('click', () => {
    if (!PRODS.length) { showToast('Still loading products…'); return; }
    document.querySelectorAll('.filt-btn').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    renderProds(b.dataset.f);
  });
});

/* ---- Newsletter ---- */
function handleNl(e) {
  e.preventDefault();
  showToast('Subscribed! Welcome to the family.');
  e.target.reset();
}

/* ---- Init ---- */
updCart();
fetchProducts();
