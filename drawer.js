'use strict';

/* ============================================================
   INFO DRAWER CONTENT REGISTRY
   ============================================================ */

var INFO_CONTENT = {
  'new-arrivals': {
    eyebrow: 'The Shop', title: 'New Arrivals',
    html: '<p>Fresh off the design table — our latest pieces for the season. Each new arrival is handcrafted in limited quantities.</p>'
  },
  'traditional': {
    eyebrow: 'Collections', title: 'Traditional Wear',
    html: '<p>Our Traditional Wear collection celebrates the full richness of Nigerian cultural fashion — Aso-oke, Agbada, George wrappers, and more.</p>' +
      '<h3>Bespoke Orders</h3><p>All traditional pieces can be made to measure. Our tailors deliver in 10&ndash;14 working days.</p>'
  },
  'contemporary': {
    eyebrow: 'Collections', title: 'Contemporary',
    html: '<p>Our Contemporary line bridges Nigerian heritage with modern global aesthetics. Ankara prints in unexpected silhouettes, mixed-fabric blazers, and ready-to-wear statement pieces.</p>' +
      '<h3>Sizing</h3><p>Available in sizes XS&ndash;3XL. All items can also be made bespoke.</p>'
  },
  'accessories': {
    eyebrow: 'Collections', title: 'Accessories',
    html: '<p>Complete your look — handwoven Aso-oke headgear, gele, leather bags, beaded jewellery, and artisan footwear.</p>' +
      '<h3>Categories</h3><ul><li>Gele &amp; Head ties</li><li>Beaded jewellery sets</li><li>Artisan leather handbags</li><li>Embroidered footwear</li><li>Fabric clutch bags</li></ul>'
  },
  'sale': {
    eyebrow: 'The Shop', title: 'Sale',
    html: '<p>Limited-time offers on selected pieces. All sale items are final quality — we never discount seconds or defective goods.</p>'
  },
  'contact': {
    eyebrow: 'Customer Care', title: 'Contact Us',
    html: '<p>We\'d love to hear from you.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.75rem;margin-bottom:1.5rem;">' +
        '<div style="flex:1;min-width:140px;background:var(--deep);border:1px solid var(--border);border-radius:var(--r3);padding:.9rem 1rem;"><div style="font-size:.65rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--amber);margin-bottom:.3rem;">WhatsApp</div><div style="font-size:.88rem;color:var(--tp);font-weight:500;">+234 801 234 5678</div></div>' +
        '<div style="flex:1;min-width:140px;background:var(--deep);border:1px solid var(--border);border-radius:var(--r3);padding:.9rem 1rem;"><div style="font-size:.65rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--amber);margin-bottom:.3rem;">Email</div><div style="font-size:.88rem;color:var(--tp);font-weight:500;">hello@brightnals.ng</div></div>' +
        '<div style="flex:1;min-width:140px;background:var(--deep);border:1px solid var(--border);border-radius:var(--r3);padding:.9rem 1rem;"><div style="font-size:.65rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--amber);margin-bottom:.3rem;">Hours</div><div style="font-size:.88rem;color:var(--tp);font-weight:500;">Mon&ndash;Sat, 9am&ndash;6pm</div></div>' +
      '</div>' +
      '<div class="contact-form">' +
        '<div><label class="cf-label">Your Name</label><input type="text" class="cf-inp" placeholder="Chisom Okafor"/></div>' +
        '<div><label class="cf-label">Email Address</label><input type="email" class="cf-inp" placeholder="your@email.com"/></div>' +
        '<div><label class="cf-label">Message</label><textarea class="cf-ta" placeholder="Tell us how we can help\u2026"></textarea></div>' +
        '<button class="cf-send" onclick="showToast(\'Message sent! We\u2019ll reply within 24 hours.\')">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
          ' Send Message</button>' +
      '</div>'
  },
  'size-guide': {
    eyebrow: 'Customer Care', title: 'Size Guide',
    html: '<p>All measurements in centimetres. For bespoke orders, we take your exact measurements.</p>' +
      '<h3>Women\'s Tops &amp; Dresses</h3>' +
      '<table class="size-table"><thead><tr><th>Size</th><th>Bust</th><th>Waist</th><th>Hips</th></tr></thead><tbody>' +
        '<tr><td>XS</td><td>80&ndash;84</td><td>62&ndash;66</td><td>88&ndash;92</td></tr>' +
        '<tr><td>S</td><td>84&ndash;88</td><td>66&ndash;70</td><td>92&ndash;96</td></tr>' +
        '<tr><td>M</td><td>88&ndash;94</td><td>70&ndash;76</td><td>96&ndash;102</td></tr>' +
        '<tr><td>L</td><td>94&ndash;100</td><td>76&ndash;82</td><td>102&ndash;108</td></tr>' +
        '<tr><td>XL</td><td>100&ndash;108</td><td>82&ndash;90</td><td>108&ndash;116</td></tr>' +
        '<tr><td>2XL</td><td>108&ndash;116</td><td>90&ndash;98</td><td>116&ndash;124</td></tr>' +
        '<tr><td>3XL</td><td>116&ndash;124</td><td>98&ndash;106</td><td>124&ndash;132</td></tr>' +
      '</tbody></table>' +
      '<h3>Men\'s Agbada &amp; Suits</h3>' +
      '<table class="size-table"><thead><tr><th>Size</th><th>Chest</th><th>Waist</th><th>Shoulder</th></tr></thead><tbody>' +
        '<tr><td>S</td><td>88&ndash;92</td><td>76&ndash;80</td><td>43</td></tr>' +
        '<tr><td>M</td><td>92&ndash;98</td><td>80&ndash;86</td><td>45</td></tr>' +
        '<tr><td>L</td><td>98&ndash;104</td><td>86&ndash;92</td><td>47</td></tr>' +
        '<tr><td>XL</td><td>104&ndash;112</td><td>92&ndash;100</td><td>49</td></tr>' +
        '<tr><td>2XL</td><td>112&ndash;120</td><td>100&ndash;108</td><td>51</td></tr>' +
      '</tbody></table>'
  },
  'shipping': {
    eyebrow: 'Customer Care', title: 'Shipping Info',
    html: '<h3>Delivery Options</h3>' +
      '<div style="display:flex;flex-direction:column;gap:.6rem;margin-bottom:1.2rem;">' +
        '<div style="background:var(--deep);border:1px solid var(--border);border-radius:var(--r2);padding:.9rem 1rem;display:flex;justify-content:space-between;align-items:center;"><div><div style="font-weight:600;font-size:.88rem;color:var(--tp);">Standard Delivery</div><div style="font-size:.76rem;color:var(--tm);">Lagos, Abuja, Port Harcourt &mdash; 2&ndash;4 days</div></div><div style="font-weight:700;color:var(--amber);">Free</div></div>' +
        '<div style="background:var(--deep);border:1px solid var(--border);border-radius:var(--r2);padding:.9rem 1rem;display:flex;justify-content:space-between;align-items:center;"><div><div style="font-weight:600;font-size:.88rem;color:var(--tp);">Express Delivery</div><div style="font-size:.76rem;color:var(--tm);">Major cities &mdash; next day</div></div><div style="font-weight:700;color:var(--amber);">&#8358;2,500</div></div>' +
        '<div style="background:var(--deep);border:1px solid var(--border);border-radius:var(--r2);padding:.9rem 1rem;display:flex;justify-content:space-between;align-items:center;"><div><div style="font-weight:600;font-size:.88rem;color:var(--tp);">Nationwide Delivery</div><div style="font-size:.76rem;color:var(--tm);">Other states &mdash; 4&ndash;7 days</div></div><div style="font-weight:700;color:var(--amber);">&#8358;1,500</div></div>' +
      '</div>' +
      '<h3>Bespoke Orders</h3><p>Custom pieces require 10&ndash;14 working days before dispatch.</p>'
  },
  'returns': {
    eyebrow: 'Customer Care', title: 'Returns Policy',
    html: '<h3>30-Day Returns</h3><p>Unworn, unwashed, original packaging with tags.</p>' +
      '<h3>How to Return</h3><ul><li>Contact us within 30 days</li><li>Include your order number</li><li>We arrange pickup or drop-off</li><li>Refunds in 5&ndash;7 working days</li></ul>' +
      '<h3>Non-Returnable</h3><p>Bespoke and sale items.</p>'
  },
  'faq': {
    eyebrow: 'Customer Care', title: 'Frequently Asked',
    html: (function () {
      var pairs = [
        ['How long does a bespoke order take?', 'Bespoke orders take 10&ndash;14 working days. Rush orders (5&ndash;7 days) available for an extra fee.'],
        ['How do I get measured?', 'We send a measurement guide via WhatsApp, or book a home fitting in Lagos, Abuja, or Port Harcourt.'],
        ['Do you ship outside Nigeria?', 'Yes — UK, US, Canada, and most EU countries. 7&ndash;14 days international shipping.'],
        ['What payment methods?', 'Bank transfer, Paystack (card/USSD/bank), cash on delivery in Lagos. International: Paystack and Flutterwave.'],
        ['Can I see fabrics first?', 'Yes — fabric swatches on request, or video-call to see current stock.'],
      ];
      return pairs.map(function (qa) {
        return '<div class="faq-item"><button class="faq-q" onclick="window.toggleFaq(this)">' + qa[0] +
          '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
          '</button><div class="faq-a"><div class="faq-a-inner">' + qa[1] + '</div></div></div>';
      }).join('');
    }())
  },
  'about': {
    eyebrow: 'Company', title: 'About Us',
    html: '<p>BrightNal\'s Concepts was founded in 2019 by Bright Chinalu — a Nigerian fashion brand built to stand on the global stage without abandoning its roots.</p>' +
      '<h3>The Founder</h3><p>Bright Chinalu grew up surrounded by bold fabrics and master tailors of Eastern Nigeria. She launched from a single studio in Owerri and now serves clients across Nigeria and the diaspora.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1rem;">' +
        '<div style="flex:1;min-width:80px;background:var(--deep);border:1px solid var(--border);border-radius:var(--r3);padding:1rem;text-align:center;"><div style="font-family:var(--fd);font-size:1.8rem;color:var(--tp);">6+</div><div style="font-size:.68rem;color:var(--tm);text-transform:uppercase;letter-spacing:.1em;font-weight:600;">Years</div></div>' +
        '<div style="flex:1;min-width:80px;background:var(--deep);border:1px solid var(--border);border-radius:var(--r3);padding:1rem;text-align:center;"><div style="font-family:var(--fd);font-size:1.8rem;color:var(--tp);">2k+</div><div style="font-size:.68rem;color:var(--tm);text-transform:uppercase;letter-spacing:.1em;font-weight:600;">Clients</div></div>' +
        '<div style="flex:1;min-width:80px;background:var(--deep);border:1px solid var(--border);border-radius:var(--r3);padding:1rem;text-align:center;"><div style="font-family:var(--fd);font-size:1.8rem;color:var(--tp);">100%</div><div style="font-size:.68rem;color:var(--tm);text-transform:uppercase;letter-spacing:.1em;font-weight:600;">Nigerian</div></div>' +
      '</div>'
  },
  'artisans': {
    eyebrow: 'Company', title: 'Our Artisans',
    html: '<p>Every piece is brought to life by skilled Nigerian artisans — some perfecting their craft for over 20 years.</p>' +
      '<div class="artisan-grid">' +
        '<div class="artisan-card"><div class="artisan-card-img"><img src="/20260319_164129.png" alt="Artisan"/></div><div class="artisan-card-body"><div class="artisan-name">Chukwuemeka O.</div><div class="artisan-role">Master Tailor &middot; 18 yrs</div></div></div>' +
        '<div class="artisan-card"><div class="artisan-card-img"><img src="/20260319_164506.jpg" alt="Artisan"/></div><div class="artisan-card-body"><div class="artisan-name">Fatimah A.</div><div class="artisan-role">Embroidery Specialist</div></div></div>' +
        '<div class="artisan-card"><div class="artisan-card-img"><img src="/IMG-20260215-WA0011.jpg" alt="Artisan"/></div><div class="artisan-card-body"><div class="artisan-name">Ngozi I.</div><div class="artisan-role">Aso-oke Weaver</div></div></div>' +
        '<div class="artisan-card"><div class="artisan-card-img"><img src="/20260319_175030.jpg" alt="Artisan"/></div><div class="artisan-card-body"><div class="artisan-name">Bello M.</div><div class="artisan-role">Pattern Cutter</div></div></div>' +
      '</div>'
  },
  'press': {
    eyebrow: 'Company', title: 'Press &amp; Media',
    html: '<p>For press enquiries or media requests: <strong>press@brightnals.ng</strong></p>' +
      '<div style="display:flex;flex-direction:column;gap:.6rem;margin-top:.75rem;">' +
        '<div style="background:var(--deep);border:1px solid var(--border);border-radius:var(--r2);padding:.85rem 1rem;"><div style="font-weight:600;font-size:.86rem;color:var(--tp);">&ldquo;Top 10 Nigerian Fashion Brands to Watch&rdquo;</div><div style="font-size:.74rem;color:var(--tm);">Vanguard Allure &middot; 2024</div></div>' +
        '<div style="background:var(--deep);border:1px solid var(--border);border-radius:var(--r2);padding:.85rem 1rem;"><div style="font-weight:600;font-size:.86rem;color:var(--tp);">&ldquo;Naija Designers Redefining African Luxury&rdquo;</div><div style="font-size:.74rem;color:var(--tm);">ThisDay Style &middot; 2024</div></div>' +
        '<div style="background:var(--deep);border:1px solid var(--border);border-radius:var(--r2);padding:.85rem 1rem;"><div style="font-weight:600;font-size:.86rem;color:var(--tp);">&ldquo;BrightNal\'s: Culture as Couture&rdquo;</div><div style="font-size:.74rem;color:var(--tm);">Guardian Life &middot; 2023</div></div>' +
      '</div>'
  },
  'privacy': {
    eyebrow: 'Legal', title: 'Privacy Policy',
    html: '<p>We collect name, email, phone, delivery address, and measurements for orders. We use your data to fulfil orders, send updates, and improve our service. We never sell your data.</p>' +
      '<p>Contact: <strong>privacy@brightnals.ng</strong></p><p style="font-size:.78rem;color:var(--tm);">Last updated: March 2025</p>'
  },
  'terms': {
    eyebrow: 'Legal', title: 'Terms &amp; Conditions',
    html: '<p>By using this website or placing an order, you agree to these terms. Payment in full required before production or dispatch. Bespoke orders require 50% deposit. All content is intellectual property of BrightNal\'s Concepts.</p>' +
      '<p style="font-size:.78rem;color:var(--tm);">Governed by the laws of the Federal Republic of Nigeria. Last updated: March 2025</p>'
  },
  'cookies': {
    eyebrow: 'Legal', title: 'Cookie Policy',
    html: '<p>We use essential cookies (shopping cart), analytics cookies (site performance), and preference cookies (your settings). Manage via your browser settings.</p>' +
      '<p style="font-size:.78rem;color:var(--tm);">Last updated: March 2025</p>'
  }
};


/* ============================================================
   BOTTOM DRAWER ENGINE
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  var bg          = document.getElementById('bdwgBg');
  var searchDwg   = document.getElementById('searchDrawer');
  var infoDwg     = document.getElementById('infoDrawer');
  var productDwg  = document.getElementById('productDrawer');

  if (!bg || !searchDwg || !infoDwg || !productDwg) {
    console.warn('drawer.js: one or more drawer elements missing');
    return;
  }

  /* ---- Pagination state ---- */
  var PAGE_SIZE    = 10;
  var searchPage   = 1;
  var lastFiltered = [];

  /* ---- Currently open product ---- */
  var activeProductId = null;

  /* ===========================================================
     OPEN / CLOSE
     =========================================================== */

  function openSearch() {
    closeAllBottomDrawers();
    bg.classList.add('open');
    searchDwg.classList.add('open');
    // Always start fresh — clear any previous query
    var inp = document.getElementById('searchInp');
    if (inp) inp.value = '';
    setTimeout(function () {
      if (inp) inp.focus();
    }, 400);
    searchPage = 1;
    buildSearchResults('');
  }

  function clearSearchInput() {
    var inp = document.getElementById('searchInp');
    if (inp) inp.value = '';
  }

  function closeSearch() {
    searchDwg.classList.remove('open');
    clearSearchInput();
    if (!infoDwg.classList.contains('open') &&
        !productDwg.classList.contains('open')) {
      bg.classList.remove('open');
    }
  }

  function closeInfoDrawer() {
    infoDwg.classList.remove('open');
    if (!searchDwg.classList.contains('open') &&
        !productDwg.classList.contains('open')) {
      bg.classList.remove('open');
    }
  }

  function openProductDrawer(id) {
    var prods = window.PRODS || [];
    var p = prods.filter(function (x) { return x.id === id; })[0];
    if (!p) return;

    activeProductId = id;

    /* Populate fields */
    var img   = document.getElementById('pdwgImg');
    var name  = document.getElementById('pdwgName');
    var price = document.getElementById('pdwgPrice');
    var desc  = document.getElementById('pdwgDesc');
    var cat   = document.getElementById('pdwgCat');
    var meta  = document.getElementById('pdwgMeta');
    var wish  = productDwg.querySelector('.pdwg-wish');

    if (img)   { img.src = p.img; img.alt = p.name; }
    if (name)  name.textContent  = p.name;
    if (price) price.innerHTML   = '&#8358;' + Number(p.price).toLocaleString('en-NG');
    if (cat)   cat.textContent   = p.cat || '';
    if (desc)  desc.textContent  = p.description || 'Handcrafted in Nigeria with premium materials. Available in all sizes — contact us for custom measurements.';

    /* Meta chips */
    if (meta) {
      var chips = '';
      if (p.sizes)  chips += '<span class="pdwg-chip"><span class="pdwg-chip-label">Sizes</span> ' + p.sizes  + '</span>';
      if (p.colors) chips += '<span class="pdwg-chip"><span class="pdwg-chip-label">Colors</span> ' + p.colors + '</span>';
      if (p.stock !== undefined && p.stock !== null) {
        var inStock = Number(p.stock) > 0;
        chips += '<span class="pdwg-chip" style="color:' + (inStock ? 'var(--sage)' : 'var(--coral)') + '">' +
          (inStock ? Number(p.stock) + ' in stock' : 'Out of stock') + '</span>';
      }
      meta.innerHTML = chips;
    }

    /* Wishlist button state */
    if (wish) wish.classList.remove('saved');

    /* Scroll inner body to top */
    var inner = productDwg.querySelector('.pdwg-inner');
    if (inner) inner.scrollTop = 0;

    closeSearch();
    bg.classList.add('open');
    productDwg.classList.add('open');
  }

  function closeProductDrawer() {
    productDwg.classList.remove('open');
    if (!searchDwg.classList.contains('open') &&
        !infoDwg.classList.contains('open')) {
      bg.classList.remove('open');
    }
    activeProductId = null;
  }

  function closeAllBottomDrawers() {
    searchDwg.classList.remove('open');
    infoDwg.classList.remove('open');
    productDwg.classList.remove('open');
    bg.classList.remove('open');
    activeProductId = null;
    var inp = document.getElementById('searchInp');
    if (inp) inp.value = '';
  }

  /* Product drawer action buttons */
  function pdwgAddToCart() {
    if (activeProductId !== null && typeof window.addCart === 'function') {
      window.addCart(activeProductId);
      closeProductDrawer();
    }
  }

  function pdwgWishlist() {
    if (activeProductId !== null && typeof window.doWish === 'function') {
      window.doWish(activeProductId);
      var wish = productDwg.querySelector('.pdwg-wish');
      if (wish) wish.classList.toggle('saved');
    }
  }

  /* ESC key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllBottomDrawers();
  });

  /* Backdrop click */
  bg.addEventListener('click', closeAllBottomDrawers);


  /* ===========================================================
     SEARCH — reads window.PRODS (real DB data from main.js)
     =========================================================== */

  function fmtPrice(n) {
    return '&#8358;' + Number(n).toLocaleString('en-NG');
  }

  /* Each card is clickable — opens product drawer */
  function productCard(p) {
    return '<div class="sdwg-res-item" style="cursor:pointer;" onclick="window.openProductDrawer(' + p.id + ')">' +
      '<div class="sdwg-res-img"><img src="' + p.img + '" alt="' + p.name + '" onerror="this.style.display=\'none\'"/></div>' +
      '<div class="sdwg-res-body">' +
        '<div class="sdwg-res-name">' + p.name + '</div>' +
        '<div style="font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--amber);margin:.1rem 0 .25rem;">' + (p.cat || '') + '</div>' +
        '<div class="sdwg-res-price">' + fmtPrice(p.price) + '</div>' +
      '</div></div>';
  }

  function renderPage(filtered, page, append) {
    var el = document.getElementById('searchResults');
    if (!el) return;

    var start   = (page - 1) * PAGE_SIZE;
    var slice   = filtered.slice(start, start + PAGE_SIZE);
    var hasMore = (start + PAGE_SIZE) < filtered.length;

    var oldMore = document.getElementById('sdwgLoadMore');
    if (oldMore) oldMore.remove();

    if (append) {
      el.insertAdjacentHTML('beforeend', slice.map(productCard).join(''));
    } else {
      el.innerHTML = slice.length
        ? slice.map(productCard).join('')
        : '<div style="grid-column:1/-1;padding:2rem;text-align:center;color:var(--tm);font-size:.86rem;">No results found</div>';
    }

    if (hasMore) {
      var remaining = filtered.length - (start + PAGE_SIZE);
      var wrap = document.createElement('div');
      wrap.id = 'sdwgLoadMore';
      wrap.style.cssText = 'grid-column:1/-1;display:flex;justify-content:center;padding:1.2rem 0 .5rem;';
      wrap.innerHTML =
        '<button onclick="window.loadMoreSearch()" style="' +
          'display:inline-flex;align-items:center;gap:.5rem;background:none;' +
          'border:1px solid var(--border-b);color:var(--ts);padding:.7rem 1.6rem;' +
          'border-radius:var(--rp);font-family:var(--fb);font-size:.78rem;font-weight:600;' +
          'letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:all .2s;' +
        '" onmouseover="this.style.background=\'var(--tp)\';this.style.color=\'var(--surface)\';" ' +
           'onmouseout="this.style.background=\'none\';this.style.color=\'var(--ts)\';">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
          'Load ' + remaining + ' more</button>';
      el.parentNode.insertBefore(wrap, el.nextSibling);
    }
  }

  function buildSearchResults(query) {
    var lbl = document.getElementById('searchResultsLbl');
    var q   = (query || '').trim().toLowerCase();
    if (lbl) lbl.textContent = q ? 'Results for "' + query + '"' : 'All Products';

    var prods    = window.PRODS || [];
    var filtered = q
      ? prods.filter(function (p) {
          return p.name.toLowerCase().indexOf(q) !== -1 ||
                 (p.cat && p.cat.toLowerCase().indexOf(q) !== -1);
        })
      : prods;

    lastFiltered = filtered;
    searchPage   = 1;
    renderPage(filtered, 1, false);
  }

  function loadMoreSearch() {
    searchPage++;
    renderPage(lastFiltered, searchPage, true);
  }

  function handleSearch(val) { buildSearchResults(val); }

  function searchFor(term) {
    var inp = document.getElementById('searchInp');
    if (inp) inp.value = term;
    buildSearchResults(term);
  }

  function doSearch() {
    var inp = document.getElementById('searchInp');
    buildSearchResults(inp ? inp.value : '');
  }

  /* ===========================================================
     INFO DRAWER
     =========================================================== */

  function openInfoDrawer(key) {
    var content = INFO_CONTENT[key];
    if (!content) { console.warn('drawer.js: unknown key', key); return; }
    var eyebrow = document.getElementById('idwgEyebrow');
    var title   = document.getElementById('idwgTitle');
    var body    = document.getElementById('idwgBody');
    var inner   = infoDwg.querySelector('.bdwg-inner');
    if (eyebrow) eyebrow.textContent = content.eyebrow;
    if (title)   title.innerHTML     = content.title;
    if (body)    body.innerHTML      = content.html;
    if (inner)   inner.scrollTop     = 0;
    closeSearch();
    closeProductDrawer();
    bg.classList.add('open');
    infoDwg.classList.add('open');
  }

  /* ---- FAQ accordion ---- */
  function toggleFaq(btn) {
    var item    = btn.closest('.faq-item');
    var wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function (i) { i.classList.remove('open'); });
    if (!wasOpen) item.classList.add('open');
  }

  /* ===========================================================
     EXPOSE TO WINDOW
     =========================================================== */
  window.openSearch            = openSearch;
  window.closeSearch           = closeSearch;
  window.closeInfoDrawer       = closeInfoDrawer;
  window.openProductDrawer     = openProductDrawer;
  window.closeProductDrawer    = closeProductDrawer;
  window.closeAllBottomDrawers = closeAllBottomDrawers;
  window.pdwgAddToCart         = pdwgAddToCart;
  window.pdwgWishlist          = pdwgWishlist;
  window.handleSearch          = handleSearch;
  window.searchFor             = searchFor;
  window.doSearch              = doSearch;
  window.loadMoreSearch        = loadMoreSearch;
  window.openInfoDrawer        = openInfoDrawer;
  window.toggleFaq             = toggleFaq;

});
