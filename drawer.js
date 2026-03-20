'use strict';

/* ============================================================
   INFO DRAWER CONTENT REGISTRY
   Pure data — defined first, outside DOMContentLoaded,
   so openInfoDrawer() can reference it from anywhere.
   ============================================================ */

var INFO_CONTENT = {

  'new-arrivals': {
    eyebrow: 'The Shop',
    title: 'New Arrivals',
    html: '<p>Fresh off the design table — our latest pieces for the season. Each new arrival is handcrafted in limited quantities.</p>' +
      '<div class="idwg-grid">' +
        '<div class="idwg-card"><div class="idwg-card-img"><img src="/m3661khbfheuqsmvmdw7.png" alt="New"/></div><div class="idwg-card-body"><div class="idwg-card-name">Aso-oke Bridal Set</div><div class="idwg-card-price">&#8358;85,000</div></div></div>' +
        '<div class="idwg-card"><div class="idwg-card-img"><img src="/17736084008436794626483816881688.png" alt="New"/></div><div class="idwg-card-body"><div class="idwg-card-name">Ankara Power Blouse</div><div class="idwg-card-price">&#8358;32,000</div></div></div>' +
        '<div class="idwg-card"><div class="idwg-card-img"><img src="/image-23.jpg" alt="New"/></div><div class="idwg-card-body"><div class="idwg-card-name">Corporate Suit</div><div class="idwg-card-price">&#8358;58,000</div></div></div>' +
        '<div class="idwg-card"><div class="idwg-card-img"><img src="/image-12.jpg" alt="New"/></div><div class="idwg-card-body"><div class="idwg-card-name">Embroidered Kaftan</div><div class="idwg-card-price">&#8358;27,500</div></div></div>' +
      '</div>'
  },

  'traditional': {
    eyebrow: 'Collections',
    title: 'Traditional Wear',
    html: '<p>Our Traditional Wear collection celebrates the full richness of Nigerian cultural fashion — Aso-oke, Agbada, George wrappers, and more — crafted to the highest standard.</p>' +
      '<h3>What We Offer</h3><p>Every piece is made using authentic Nigerian fabrics sourced from trusted weavers. From Yoruba Aso-oke to Igbo George and Hausa Babban Riga, we cover the full spectrum of Nigerian heritage wear.</p>' +
      '<h3>Bespoke Orders</h3><p>All traditional pieces can be made to measure. Contact us with your measurements and preferred style reference — our tailors deliver in 10&ndash;14 working days.</p>'
  },

  'contemporary': {
    eyebrow: 'Collections',
    title: 'Contemporary',
    html: '<p>Our Contemporary line bridges Nigerian heritage with modern global aesthetics. Think Ankara prints in unexpected silhouettes, mixed-fabric blazers, and ready-to-wear statement pieces.</p>' +
      '<h3>Design Philosophy</h3><p>We take fabrics rooted in tradition and reimagine them for the modern Nigerian woman and man — without losing the cultural essence that makes them special.</p>' +
      '<h3>Sizing</h3><p>Contemporary pieces are available in sizes XS&ndash;3XL. All items can also be made bespoke. See our size guide for measurements.</p>'
  },

  'accessories': {
    eyebrow: 'Collections',
    title: 'Accessories',
    html: '<p>Complete your look with our curated accessories — from handwoven Aso-oke headgear and gele to leather bags, beaded jewellery, and artisan footwear.</p>' +
      '<h3>Categories</h3><ul><li>Gele &amp; Head ties</li><li>Beaded jewellery sets</li><li>Artisan leather handbags</li><li>Embroidered footwear</li><li>Fabric clutch bags</li></ul>' +
      '<p>All accessories are made in Nigeria and can be ordered with coordinating outfits for full look packages.</p>'
  },

  'sale': {
    eyebrow: 'The Shop',
    title: 'Sale',
    html: '<p>Limited-time offers on selected pieces. All sale items are final quality — we never discount seconds or defective goods.</p>' +
      '<div class="idwg-grid">' +
        '<div class="idwg-card"><div class="idwg-card-img"><img src="/image-23.jpg" alt="Sale"/></div><div class="idwg-card-body"><span class="sale-badge">30% Off</span><div class="idwg-card-name">Ankara Wrap Dress</div><div class="idwg-card-price">&#8358;21,000 <span style="text-decoration:line-through;color:var(--tm);font-weight:400;">&#8358;30,000</span></div></div></div>' +
        '<div class="idwg-card"><div class="idwg-card-img"><img src="/image-12.jpg" alt="Sale"/></div><div class="idwg-card-body"><span class="sale-badge">20% Off</span><div class="idwg-card-name">Kaftan Embroidered</div><div class="idwg-card-price">&#8358;22,000 <span style="text-decoration:line-through;color:var(--tm);font-weight:400;">&#8358;27,500</span></div></div></div>' +
      '</div>' +
      '<p style="margin-top:1rem;font-size:.82rem;color:var(--tm);">Sale ends when stock runs out. No further discounts apply on sale items.</p>'
  },

  'contact': {
    eyebrow: 'Customer Care',
    title: 'Contact Us',
    html: '<p>We\'d love to hear from you. Reach out via the form below or through any of our channels.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.75rem;margin-bottom:1.5rem;">' +
        '<div style="flex:1;min-width:140px;background:var(--deep);border:1px solid var(--border);border-radius:var(--r3);padding:.9rem 1rem;"><div style="font-size:.65rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--amber);margin-bottom:.3rem;">WhatsApp</div><div style="font-size:.88rem;color:var(--tp);font-weight:500;">+234 703 891 7027</div></div>' +
        '<div style="flex:1;min-width:140px;background:var(--deep);border:1px solid var(--border);border-radius:var(--r3);padding:.9rem 1rem;"><div style="font-size:.65rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--amber);margin-bottom:.3rem;">Email</div><div style="font-size:.88rem;color:var(--tp);font-weight:500;">hello@brightnals.ng</div></div>' +
        '<div style="flex:1;min-width:140px;background:var(--deep);border:1px solid var(--border);border-radius:var(--r3);padding:.9rem 1rem;"><div style="font-size:.65rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:var(--amber);margin-bottom:.3rem;">Hours</div><div style="font-size:.88rem;color:var(--tp);font-weight:500;">Mon&ndash;Sat, 9am&ndash;6pm</div></div>' +
      '</div>' +
      '<div class="contact-form">' +
        '<div><label class="cf-label">Your Name</label><input type="text" class="cf-inp" placeholder="Chisom Okafor"/></div>' +
        '<div><label class="cf-label">Email Address</label><input type="email" class="cf-inp" placeholder="your@email.com"/></div>' +
        '<div><label class="cf-label">Message</label><textarea class="cf-ta" placeholder="Tell us how we can help\u2026"></textarea></div>' +
        '<button class="cf-send" onclick="showToast(\'Message sent! We\\u2019ll reply within 24 hours.\')">' +
          '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
          ' Send Message</button>' +
      '</div>'
  },

  'size-guide': {
    eyebrow: 'Customer Care',
    title: 'Size Guide',
    html: '<p>All measurements are in centimetres. For bespoke orders, we take your exact measurements — standard sizes are a guide only.</p>' +
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
      '</tbody></table>' +
      '<p style="font-size:.8rem;color:var(--tm);margin-top:1rem;">Not sure of your size? Chat us on WhatsApp and we\'ll guide you through measuring yourself correctly.</p>'
  },

  'shipping': {
    eyebrow: 'Customer Care',
    title: 'Shipping Info',
    html: '<h3>Delivery Options</h3>' +
      '<div style="display:flex;flex-direction:column;gap:.6rem;margin-bottom:1.2rem;">' +
        '<div style="background:var(--deep);border:1px solid var(--border);border-radius:var(--r2);padding:.9rem 1rem;display:flex;justify-content:space-between;align-items:center;"><div><div style="font-weight:600;font-size:.88rem;color:var(--tp);">Standard Delivery</div><div style="font-size:.76rem;color:var(--tm);">Lagos, Abuja, Port Harcourt &mdash; 2&ndash;4 days</div></div><div style="font-weight:700;color:var(--amber);">Free</div></div>' +
        '<div style="background:var(--deep);border:1px solid var(--border);border-radius:var(--r2);padding:.9rem 1rem;display:flex;justify-content:space-between;align-items:center;"><div><div style="font-weight:600;font-size:.88rem;color:var(--tp);">Express Delivery</div><div style="font-size:.76rem;color:var(--tm);">Major cities &mdash; next day</div></div><div style="font-weight:700;color:var(--amber);">&#8358;2,500</div></div>' +
        '<div style="background:var(--deep);border:1px solid var(--border);border-radius:var(--r2);padding:.9rem 1rem;display:flex;justify-content:space-between;align-items:center;"><div><div style="font-weight:600;font-size:.88rem;color:var(--tp);">Nationwide Delivery</div><div style="font-size:.76rem;color:var(--tm);">Other states &mdash; 4&ndash;7 days</div></div><div style="font-weight:700;color:var(--amber);">&#8358;1,500</div></div>' +
      '</div>' +
      '<h3>Bespoke Orders</h3><p>Custom and bespoke pieces require 10&ndash;14 working days production time before dispatch. You will receive updates at each stage via WhatsApp.</p>' +
      '<h3>Order Tracking</h3><p>Once your order is dispatched, you\'ll receive a tracking number via SMS and email. Track your delivery in real time through our logistics partner\'s portal.</p>'
  },

  'returns': {
    eyebrow: 'Customer Care',
    title: 'Returns Policy',
    html: '<h3>30-Day Returns</h3><p>We offer a 30-day return policy on all ready-to-wear items. Items must be unworn, unwashed, and in their original packaging with tags attached.</p>' +
      '<h3>How to Return</h3><ul>' +
        '<li>Contact us via WhatsApp or email within 30 days of receipt</li>' +
        '<li>Include your order number and reason for return</li>' +
        '<li>We\'ll arrange a pickup or drop-off point near you</li>' +
        '<li>Refunds are processed within 5&ndash;7 working days of receiving the item</li>' +
      '</ul>' +
      '<h3>Non-Returnable Items</h3><p>Bespoke and custom-made orders cannot be returned unless there is a manufacturing defect. Sale items are also non-returnable.</p>' +
      '<h3>Exchanges</h3><p>We\'re happy to exchange for a different size or colour where stock allows. Contact our team and we\'ll make it work.</p>'
  },

  'faq': {
    eyebrow: 'Customer Care',
    title: 'Frequently Asked',
    html: (function () {
      var pairs = [
        ['How long does a bespoke order take?',       'Bespoke orders take 10&ndash;14 working days from confirmed measurements. Rush orders (5&ndash;7 days) are available for an additional fee.'],
        ['How do I get measured for a custom piece?', 'We\'ll send you a simple measurement guide via WhatsApp. You can measure at home, or if you\'re in Lagos/Abuja/PH, book a home fitting with our team.'],
        ['Do you ship outside Nigeria?',              'Yes! We ship to the UK, US, Canada, and most EU countries. International shipping typically takes 7&ndash;14 days. Contact us for a quote.'],
        ['What payment methods do you accept?',       'Bank transfer, Paystack (card/USSD/bank), and cash on delivery within Lagos. International orders: Paystack and Flutterwave.'],
        ['Can I see fabrics before ordering?',        'We can send fabric swatches on request for bespoke orders. Our team can also video-call to show you current fabric stock.'],
      ];
      return pairs.map(function (qa) {
        return '<div class="faq-item">' +
          '<button class="faq-q" onclick="window.toggleFaq(this)">' + qa[0] +
            '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
          '</button>' +
          '<div class="faq-a"><div class="faq-a-inner">' + qa[1] + '</div></div>' +
        '</div>';
      }).join('');
    }())
  },

  'about': {
    eyebrow: 'Company',
    title: 'About Us',
    html: '<p>BrightNal\'s Concepts was founded in 2019 by Bright Chinalu with a singular vision: to create a Nigerian fashion brand that could stand proudly on the global stage without abandoning its roots.</p>' +
      '<h3>Our Mission</h3><p>To dress Nigerians &mdash; and lovers of Nigerian culture worldwide &mdash; in clothes that honour where we come from while embracing where we\'re going.</p>' +
      '<h3>The Founder</h3><p>Bright Chinalu grew up surrounded by the bold fabrics and master tailors of Eastern Nigeria. After years of studying design and working with local artisans, she launched BrightNal\'s Concepts from a single studio in Owerri.</p>' +
      '<h3>By the Numbers</h3>' +
      '<div style="display:flex;flex-wrap:wrap;gap:.75rem;margin-top:.5rem;">' +
        '<div style="flex:1;min-width:100px;background:var(--deep);border:1px solid var(--border);border-radius:var(--r3);padding:1rem;text-align:center;"><div style="font-family:var(--fd);font-size:1.8rem;color:var(--tp);">6+</div><div style="font-size:.68rem;color:var(--tm);text-transform:uppercase;letter-spacing:.1em;font-weight:600;">Years</div></div>' +
        '<div style="flex:1;min-width:100px;background:var(--deep);border:1px solid var(--border);border-radius:var(--r3);padding:1rem;text-align:center;"><div style="font-family:var(--fd);font-size:1.8rem;color:var(--tp);">2k+</div><div style="font-size:.68rem;color:var(--tm);text-transform:uppercase;letter-spacing:.1em;font-weight:600;">Clients</div></div>' +
        '<div style="flex:1;min-width:100px;background:var(--deep);border:1px solid var(--border);border-radius:var(--r3);padding:1rem;text-align:center;"><div style="font-family:var(--fd);font-size:1.8rem;color:var(--tp);">100%</div><div style="font-size:.68rem;color:var(--tm);text-transform:uppercase;letter-spacing:.1em;font-weight:600;">Nigerian</div></div>' +
      '</div>'
  },

  'artisans': {
    eyebrow: 'Company',
    title: 'Our Artisans',
    html: '<p>Every BrightNal\'s piece is brought to life by skilled Nigerian artisans &mdash; some perfecting their craft for over 20 years. We believe in fair wages, safe workshops, and long-term relationships.</p>' +
      '<div class="artisan-grid">' +
        '<div class="artisan-card"><div class="artisan-card-img"><img src="/20260319_164129.png" alt="Artisan"/></div><div class="artisan-card-body"><div class="artisan-name">Chukwuemeka O.</div><div class="artisan-role">Master Tailor &middot; 18 yrs</div></div></div>' +
        '<div class="artisan-card"><div class="artisan-card-img"><img src="/20260319_164506.jpg" alt="Artisan"/></div><div class="artisan-card-body"><div class="artisan-name">Fatimah A.</div><div class="artisan-role">Embroidery Specialist</div></div></div>' +
        '<div class="artisan-card"><div class="artisan-card-img"><img src="/IMG-20260215-WA0011.jpg" alt="Artisan"/></div><div class="artisan-card-body"><div class="artisan-name">Ngozi I.</div><div class="artisan-role">Aso-oke Weaver</div></div></div>' +
        '<div class="artisan-card"><div class="artisan-card-img"><img src="/20260319_175030.jpg" alt="Artisan"/></div><div class="artisan-card-body"><div class="artisan-name">Bello M.</div><div class="artisan-role">Pattern Cutter</div></div></div>' +
      '</div>' +
      '<p style="margin-top:1.2rem;font-size:.82rem;color:var(--tm);">We currently employ 14 full-time artisans across our Lagos and Owerri studios.</p>'
  },

  'press': {
    eyebrow: 'Company',
    title: 'Press &amp; Media',
    html: '<p>For press enquiries, editorial features, or media requests, please reach out to our PR team.</p>' +
      '<h3>Media Contact</h3><p><strong>press@brightnals.ng</strong><br>Response within 48 hours.</p>' +
      '<h3>Recent Features</h3>' +
      '<div style="display:flex;flex-direction:column;gap:.6rem;margin-top:.5rem;">' +
        '<div style="background:var(--deep);border:1px solid var(--border);border-radius:var(--r2);padding:.85rem 1rem;"><div style="font-weight:600;font-size:.86rem;color:var(--tp);">&ldquo;Top 10 Nigerian Fashion Brands to Watch&rdquo;</div><div style="font-size:.74rem;color:var(--tm);margin-top:.2rem;">Vanguard Allure &middot; 2024</div></div>' +
        '<div style="background:var(--deep);border:1px solid var(--border);border-radius:var(--r2);padding:.85rem 1rem;"><div style="font-weight:600;font-size:.86rem;color:var(--tp);">&ldquo;Naija Designers Redefining African Luxury&rdquo;</div><div style="font-size:.74rem;color:var(--tm);margin-top:.2rem;">ThisDay Style &middot; 2024</div></div>' +
        '<div style="background:var(--deep);border:1px solid var(--border);border-radius:var(--r2);padding:.85rem 1rem;"><div style="font-weight:600;font-size:.86rem;color:var(--tp);">&ldquo;BrightNal\'s: Culture as Couture&rdquo;</div><div style="font-size:.74rem;color:var(--tm);margin-top:.2rem;">Guardian Life &middot; 2023</div></div>' +
      '</div>'
  },

  'privacy': {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    html: '<p>Your privacy matters to us. This policy explains how BrightNal\'s Concepts collects, uses, and protects your personal information.</p>' +
      '<h3>What We Collect</h3><ul><li>Name, email, and phone number when you place an order</li><li>Delivery address and payment info (processed securely via Paystack)</li><li>Body measurements for bespoke orders</li><li>Browsing data to improve your experience</li></ul>' +
      '<h3>How We Use Your Data</h3><ul><li>To fulfil and track your orders</li><li>To send order and delivery updates</li><li>To send our newsletter (opt-in only)</li><li>To improve our website and product offering</li></ul>' +
      '<h3>Your Rights</h3><p>Request to view, update, or delete your data at any time: privacy@brightnals.ng. We do not sell your data.</p>' +
      '<p style="font-size:.78rem;color:var(--tm);margin-top:1rem;">Last updated: March 2025</p>'
  },

  'terms': {
    eyebrow: 'Legal',
    title: 'Terms &amp; Conditions',
    html: '<p>By using BrightNal\'s Concepts\' website or placing an order, you agree to these terms.</p>' +
      '<h3>Orders &amp; Payment</h3><p>All prices are in Nigerian Naira. Payment must be made in full before production or dispatch begins.</p>' +
      '<h3>Bespoke Orders</h3><p>Custom orders require a 50% deposit before production and full payment before delivery. Once production begins, bespoke orders cannot be cancelled except in the case of manufacturing defects.</p>' +
      '<h3>Intellectual Property</h3><p>All designs, imagery, and content are the intellectual property of BrightNal\'s Concepts. Reproduction without written permission is prohibited.</p>' +
      '<h3>Governing Law</h3><p>These terms are governed by the laws of the Federal Republic of Nigeria.</p>' +
      '<p style="font-size:.78rem;color:var(--tm);margin-top:1rem;">Last updated: March 2025</p>'
  },

  'cookies': {
    eyebrow: 'Legal',
    title: 'Cookie Policy',
    html: '<p>BrightNal\'s Concepts uses cookies to improve your browsing experience.</p>' +
      '<h3>What Are Cookies?</h3><p>Small text files stored on your device that help us remember your preferences and understand how you use our site.</p>' +
      '<h3>Cookies We Use</h3><ul><li><strong>Essential:</strong> Required for the website to function (e.g. your shopping cart)</li><li><strong>Analytics:</strong> Help us understand site traffic and improve performance</li><li><strong>Preference:</strong> Remember your settings and choices</li></ul>' +
      '<h3>Managing Cookies</h3><p>You can control cookies through your browser settings. Disabling them may affect some site functionality.</p>' +
      '<p style="font-size:.78rem;color:var(--tm);margin-top:1rem;">Last updated: March 2025</p>'
  }

};


/* ============================================================
   BOTTOM DRAWER ENGINE
   Wrapped in DOMContentLoaded so the DOM is guaranteed ready.
   All public-facing functions are pinned to window so HTML
   onclick="..." attributes can find them in strict mode.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  var bg        = document.getElementById('bdwgBg');
  var searchDwg = document.getElementById('searchDrawer');
  var infoDwg   = document.getElementById('infoDrawer');

  if (!bg || !searchDwg || !infoDwg) {
    console.warn('drawer.js: one or more drawer elements not found in DOM');
    return;
  }

  /* ---- Open / close ---- */

  function openSearch() {
    closeAllBottomDrawers();
    bg.classList.add('open');
    searchDwg.classList.add('open');
    setTimeout(function () {
      var inp = document.getElementById('searchInp');
      if (inp) inp.focus();
    }, 400);
    buildSearchResults('');
  }

  function closeSearch() {
    searchDwg.classList.remove('open');
    if (!infoDwg.classList.contains('open')) bg.classList.remove('open');
  }

  function closeInfoDrawer() {
    infoDwg.classList.remove('open');
    if (!searchDwg.classList.contains('open')) bg.classList.remove('open');
  }

  function closeAllBottomDrawers() {
    searchDwg.classList.remove('open');
    infoDwg.classList.remove('open');
    bg.classList.remove('open');
  }

  /* ESC key */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllBottomDrawers();
  });

  /* Backdrop click */
  bg.addEventListener('click', closeAllBottomDrawers);



  /* ---- Search ---- */

  var SEARCH_PRODUCTS = [
    { name: 'Aso-oke Bridal Set',         cat: 'Traditional',  price: '&#8358;85,000',  img: '/m3661khbfheuqsmvmdw7.png' },
    { name: 'Contemporary Ankara Blouse', cat: 'Contemporary', price: '&#8358;32,000',  img: '/17736084008436794626483816881688.png' },
    { name: 'Bespoke Agbada',             cat: 'Traditional',  price: '&#8358;120,000', img: '/image-23.jpg' },
    { name: 'Power Suit \u2014 Ankara',   cat: 'Corporate',    price: '&#8358;58,000',  img: '/image-12.jpg' },
    { name: 'Kaftan Embroidered',         cat: 'Casual',       price: '&#8358;27,500',  img: '/m3661khbfheuqsmvmdw7.png' },
    { name: 'Off-shoulder Gown',          cat: 'Dresses',      price: '&#8358;44,000',  img: '/17736084008436794626483816881688.png' },
  ];

  function buildSearchResults(query) {
    var el  = document.getElementById('searchResults');
    var lbl = document.getElementById('searchResultsLbl');
    if (!el || !lbl) return;

    var q        = (query || '').trim().toLowerCase();
    var filtered = q
      ? SEARCH_PRODUCTS.filter(function (p) {
          return p.name.toLowerCase().indexOf(q) !== -1 ||
                 p.cat.toLowerCase().indexOf(q) !== -1;
        })
      : SEARCH_PRODUCTS;

    lbl.textContent = q ? 'Results for "' + query + '"' : 'Trending Now';

    el.innerHTML = filtered.length
      ? filtered.map(function (p) {
          return '<div class="sdwg-res-item" onclick="window.closeSearch()">' +
            '<div class="sdwg-res-img"><img src="' + p.img + '" alt="' + p.name + '" onerror="this.style.display=\'none\'"/></div>' +
            '<div class="sdwg-res-body">' +
              '<div class="sdwg-res-name">' + p.name + '</div>' +
              '<div class="sdwg-res-price">' + p.price + '</div>' +
            '</div></div>';
        }).join('')
      : '<div style="grid-column:1/-1;padding:2rem;text-align:center;color:var(--tm);font-size:.86rem;">No results for &ldquo;<strong style="color:var(--tp)">' + query + '</strong>&rdquo;</div>';
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

  /* ---- Info drawer ---- */

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
    bg.classList.add('open');
    infoDwg.classList.add('open');
  }

  /* ---- FAQ accordion ---- */

  function toggleFaq(btn) {
    var item    = btn.closest('.faq-item');
    var wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(function (i) {
      i.classList.remove('open');
    });
    if (!wasOpen) item.classList.add('open');
  }

  /* ============================================================
     EXPOSE TO WINDOW
     Required so HTML onclick="openSearch()" etc. work in
     strict mode where top-level functions are NOT on window.
     ============================================================ */
  window.openSearch            = openSearch;
  window.closeSearch           = closeSearch;
  window.closeInfoDrawer       = closeInfoDrawer;
  window.closeAllBottomDrawers = closeAllBottomDrawers;
  window.handleSearch          = handleSearch;
  window.searchFor             = searchFor;
  window.doSearch              = doSearch;
  window.openInfoDrawer        = openInfoDrawer;
  window.toggleFaq             = toggleFaq;

});
