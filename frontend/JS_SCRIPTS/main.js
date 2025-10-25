window.addEventListener("load", () => {
    lucide.createIcons();

    // Desktop dropdown functionality
    const dropdownWrappers = document.querySelectorAll('.dropdown-wrapper');
    dropdownWrappers.forEach(wrapper => {
        const menu = wrapper.querySelector('.dropdown-menu');
        wrapper.addEventListener('mouseenter', () => menu.classList.add('show'));
        wrapper.addEventListener('mouseleave', () => menu.classList.remove('show'));
    });

    // Mobile menu functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileSidebar = document.querySelector('.mobile-sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const closeSidebar = document.querySelector('.close-sidebar');

    function openSidebar() {
        mobileSidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeSidebarFunc() {
        mobileSidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuToggle?.addEventListener('click', () => {
        mobileSidebar.classList.contains('active') ? closeSidebarFunc() : openSidebar();
    });
    closeSidebar?.addEventListener('click', closeSidebarFunc);
    sidebarOverlay?.addEventListener('click', closeSidebarFunc);

    // Mobile dropdown toggles
    document.querySelectorAll('.mobile-nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const dropdown = item.nextElementSibling;
            if (dropdown?.classList.contains('mobile-dropdown')) {
                item.classList.toggle('expanded');
                dropdown.classList.toggle('expanded');
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector(".header");
    window.addEventListener("scroll", () => {
        header.classList.toggle("scrolled", window.scrollY > 10);
    });

    // Search bar animation
    const placeholder = document.getElementById('animatedPlaceholder');
    const input = document.getElementById('searchInput');
    const placeholders = [
        'Search elegant suits and formal wears...',
        'Find trendy traditional outfits...',
        'Discover new fashion collections...',
        'Explore styles for every season...'
    ];
    let i = 0;
    function changePlaceholder() {
        placeholder.classList.remove('animate');
        void placeholder.offsetWidth;
        placeholder.classList.add('animate');
        placeholder.textContent = placeholders[i];
        i = (i + 1) % placeholders.length;
    }
    input.addEventListener('input', () => placeholder.style.display = input.value.length > 0 ? 'none' : 'block');
    setInterval(changePlaceholder, 3000);
    changePlaceholder();

    // Image slider (unchanged)
    const slider = document.querySelector('.imageSlider');
    const sliderTrack = document.querySelector('.slider-track');
    if (slider && sliderTrack) {
        const originalImages = Array.from(sliderTrack.querySelectorAll('.imageCarousel'));
        for (let j = 0; j < 123; j++) originalImages.forEach(img => sliderTrack.appendChild(img.cloneNode(true)));

        function updateImageClasses() {
            const allImages = Array.from(sliderTrack.querySelectorAll('.imageCarousel'));
            const sliderRect = slider.getBoundingClientRect();
            const sliderCenter = sliderRect.left + sliderRect.width / 2;

            let closestIndex = 0, minDistance = Infinity;
            allImages.forEach((img, idx) => {
                const imgRect = img.getBoundingClientRect();
                const imgCenter = imgRect.left + imgRect.width / 2 * 1.5;
                const distance = Math.abs(imgCenter - sliderCenter);
                if (distance < minDistance) { minDistance = distance; closestIndex = idx; }
            });

            allImages.forEach((img, idx) => {
                img.classList.remove('active', 'prev', 'next', 'gen1', 'gen2', 'gen3');
                const distance = idx - closestIndex, absDistance = Math.abs(distance);
                if (absDistance === 0) img.classList.add('active');
                else if (absDistance === 1) img.classList.add(distance < 0 ? 'prev' : 'next');
                else if (absDistance === 2) img.classList.add('gen1');
                else if (absDistance === 3) img.classList.add('gen2');
                else img.classList.add('gen3');
            });
        }
        setInterval(updateImageClasses, 100);
        updateImageClasses();
    }

    // Intro tagline animation
    const container = document.querySelector(".animateTxt");
    if (container) {
        const words = container.textContent.trim().split(/\s+/);
        container.textContent = "";
        words.forEach((word, index) => {
            const span = document.createElement("span");
            span.textContent = word + "\u00A0";
            span.style.animationDelay = `${index * 0.15}s`;
            container.appendChild(span);
        });
    }

    // Tabs functionality
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            console.log('Active tab:', tab.getAttribute('data-tab'));
        });
    });

    // Fetch and render products dynamically with placeholders
    fetchProducts();
});

// Cart and global functions
let products = [];
let cart = [];

const apiURL = "https://bright-nal-1.onrender.com/upload/files";

// Add placeholder cards while fetching
function showPlaceholders(count = 6) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    let placeholderHTML = '';
    for (let i = 0; i < count; i++) {
        placeholderHTML += `
            <div class="product-card placeholder">
                <div class="product-image-container">
                    <div class="placeholder-img"></div>
                </div>
                <div class="product-details">
                    <div class="placeholder-line short"></div>
                    <div class="placeholder-line"></div>
                    <div class="placeholder-line"></div>
                </div>
            </div>
        `;
    }
    grid.innerHTML = placeholderHTML;
}

async function fetchProducts() {
    showPlaceholders(6); // show placeholders immediately

    try {
        const res = await fetch(apiURL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        products = data.map((item, idx) => ({
            id: item.id || idx,
            name: item.product_name || "Unnamed Product",
            category: item.category || "Uncategorized",
            price: item.price || 0,
            originalPrice: item.originalPrice || null,
            image: item.image_url || "https://via.placeholder.com/400x500",
            badge: item.badge || null,
            productClass: item.productClass || "new",
            rating: item.rating || Math.floor(Math.random() * 5 + 1)
        }));
        renderProducts();
    } catch (err) {
        console.error("Failed to fetch products:", err);
        const grid = document.getElementById('productGrid');
        grid.innerHTML = `<p style="text-align:center; color:red;">Failed to load products.</p>`;
    }
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.badge ? `<div class="product-badges"><span class="badge ${product.productClass}">${product.badge.toUpperCase()}</span></div>` : ''}
                <div class="product-actions">
                    <button class="action-btn" onclick="addToWishlist(${product.id})" title="Add to Wishlist">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark-icon">
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                        </svg>
                    </button>
                </div>
                <div class="product-overlay">
                    <div class="overlay-text"><strong>${product.category}</strong></div>
                    <div class="overlay-text">Premium quality crafted with attention to detail</div>
                    <div class="overlay-text">• ${Math.floor(Math.random()*200+50)} purchases</div>
                </div>
            </div>
            <div class="product-details">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    <span class="current-price">₦${product.price.toLocaleString()}</span>
                    ${product.originalPrice ? `<span class="original-price">₦${product.originalPrice.toLocaleString()}</span>` : ''}
                </div>
                <div class="product-rating">
                    <span>${Math.floor(Math.random()*200+50)} purchases</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

// Rest of your cart functions (unchanged)
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) existingItem.quantity++;
    else cart.push({ ...product, quantity: 1 });
    updateCart();
    console.log('✅ Item added to cart!');
}
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartItemCount = document.getElementById('cartItemCount');
    const headerCartCount = document.getElementById('headerCartCount');

    if (!cart.length) {
        cartItems.innerHTML = '<p style="text-align:center; color:#999; padding:2rem;">Your cart is empty</p>';
        cartTotal.textContent = '₦0';
        cartItemCount.textContent = '0';
        headerCartCount.textContent = '0';
        headerCartCount.style.display = 'none';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price flex-row diff1">₦${item.price.toLocaleString()}<sup class="smaller">${item.quantity}</sup></div>
                <div class="cart-item-subtotal"><u>₦${(item.price*item.quantity).toLocaleString()}</u></div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + item.price*item.quantity, 0);
    cartTotal.textContent = `₦${total.toLocaleString()}`;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemCount.textContent = totalItems;
    headerCartCount.textContent = totalItems;
    headerCartCount.style.display = 'flex';
}
function removeFromCart(productId) { cart = cart.filter(item => item.id !== productId); updateCart(); }
function toggleCart() { document.getElementById('cartSidebar').classList.toggle('active'); document.querySelector('.cart-overlay').classList.toggle('active'); }
function checkout() { if (!cart.length) return console.log('Your cart is empty!'); console.log('🎉 Thank you for your purchase! Total: ' + document.getElementById('cartTotal').textContent); cart = []; updateCart(); toggleCart(); }
function addToWishlist(productId) { console.log('❤️ Added to wishlist!'); }
function quickView(productId) { const product = products.find(p => p.id === productId); console.log(`Quick View: ${product.name}\nPrice: ₦${product.price.toLocaleString()}`); }
function subscribeNewsletter(event) { event.preventDefault(); console.log('✅ Thank you for subscribing!'); event.target.reset(); }
  