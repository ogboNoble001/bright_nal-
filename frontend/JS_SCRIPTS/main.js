// Complete JavaScript for the fashion website
window.addEventListener("load", () => {
    lucide.createIcons();

    // Desktop dropdown functionality
    const dropdownWrappers = document.querySelectorAll('.dropdown-wrapper');
    dropdownWrappers.forEach(wrapper => {
        const menu = wrapper.querySelector('.dropdown-menu');
        wrapper.addEventListener('mouseenter', () => {
            menu.classList.add('show');
        });
        wrapper.addEventListener('mouseleave', () => {
            menu.classList.remove('show');
        });
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

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            if (mobileSidebar.classList.contains('active')) {
                closeSidebarFunc();
            } else {
                openSidebar();
            }
        });
    }

    if (closeSidebar) {
        closeSidebar.addEventListener('click', closeSidebarFunc);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebarFunc);
    }

    // Mobile dropdown toggles
    const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const dropdown = item.nextElementSibling;
            if (dropdown && dropdown.classList.contains('mobile-dropdown')) {
                item.classList.toggle('expanded');
                dropdown.classList.toggle('expanded');
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector(".header");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 10) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
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

    input.addEventListener('input', () => {
        if (input.value.length > 0) {
            placeholder.style.display = 'none';
        } else {
            placeholder.style.display = 'block';
        }
    });

    setInterval(changePlaceholder, 3000);
    changePlaceholder();

    // Image slider
    const slider = document.querySelector('.imageSlider');
    const sliderTrack = document.querySelector('.slider-track');
    
    if (slider && sliderTrack) {
        const originalImages = Array.from(sliderTrack.querySelectorAll('.imageCarousel'));
        
        for (let i = 0; i < 3; i++) {
            originalImages.forEach(img => {
                const clone = img.cloneNode(true);
                sliderTrack.appendChild(clone);
            });
        }
        
        function updateImageClasses() {
            const allImages = Array.from(sliderTrack.querySelectorAll('.imageCarousel'));
            const sliderRect = slider.getBoundingClientRect();
            const sliderCenter = sliderRect.left + sliderRect.width / 2;
            
            let closestIndex = 0;
            let minDistance = Infinity;
            
            allImages.forEach((img, index) => {
                const imgRect = img.getBoundingClientRect();
                const imgCenter = imgRect.left + imgRect.width / 2;
                const distanceFromCenter = Math.abs(imgCenter - sliderCenter);
                
                if (distanceFromCenter < minDistance) {
                    minDistance = distanceFromCenter;
                    closestIndex = index;
                }
            });
            
            allImages.forEach((img, index) => {
                img.classList.remove('active', 'prev', 'next', 'gen1', 'gen2', 'gen3');
                
                const distance = index - closestIndex;
                const absDistance = Math.abs(distance);
                
                if (absDistance === 0) {
                    img.classList.add('active');
                } else if (absDistance === 1) {
                    img.classList.add(distance < 0 ? 'prev' : 'next');
                } else if (absDistance === 2) {
                    img.classList.add('gen1');
                } else if (absDistance === 3) {
                    img.classList.add('gen2');
                } else {
                    img.classList.add('gen3');
                }
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
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const tabType = tab.getAttribute('data-tab');
            console.log('Active tab:', tabType);
        });
    });

    // Render products on page load
    renderProducts();
});

// Product data and cart functions (add these globally)
const products = [
    { id: 1, name: "Elegant Summer Dress", category: "Dresses", price: 89.99, originalPrice: 129.99, image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop", badge: "sale", rating: 4.5 },
    { id: 2, name: "Designer Leather Jacket", category: "Outerwear", price: 249.99, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop", badge: "new", rating: 5 },
    { id: 3, name: "Casual Cotton T-Shirt", category: "Tops", price: 29.99, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop", rating: 4 },
    { id: 4, name: "Premium Wool Sweater", category: "Knitwear", price: 119.99, image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop", rating: 4.5 },
    { id: 5, name: "Silk Blouse", category: "Tops", price: 79.99, originalPrice: 99.99, image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=500&fit=crop", badge: "sale", rating: 4 },
    { id: 6, name: "Tailored Blazer", category: "Outerwear", price: 189.99, image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=400&h=500&fit=crop", badge: "new", rating: 5 },
    { id: 7, name: "Denim Jeans", category: "Bottoms", price: 69.99, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop", rating: 4.5 },
    { id: 8, name: "Evening Gown", category: "Dresses", price: 299.99, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop", badge: "new", rating: 5 },
];

let cart = [];

function renderProducts() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;
    
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.badge ? `<div class="product-badges"><span class="badge ${product.badge}">${product.badge.toUpperCase()}</span></div>` : ''}
                <div class="product-actions">
                    <button class="action-btn" onclick="addToWishlist(${product.id})" title="Add to Wishlist">❤️</button>
                    <button class="action-btn" onclick="quickView(${product.id})" title="Quick View">👁️</button>
                </div>
                <div class="product-overlay">
                    <div class="overlay-text"><strong>${product.category}</strong></div>
                    <div class="overlay-text">Premium quality crafted with attention to detail</div>
                    <div class="overlay-text">⭐ ${product.rating} • Free shipping</div>
                </div>
            </div>
            <div class="product-details">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    <span class="current-price">$${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">$${product.originalPrice}</span>` : ''}
                </div>
                <div class="product-rating">
                    <span class="stars">${'⭐'.repeat(Math.floor(product.rating))}</span>
                    <span>(${Math.floor(Math.random() * 200 + 50)} reviews)</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCart();
    alert('✅ Item added to cart!');
}

function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartItemCount = document.getElementById('cartItemCount');
    const headerCartCount = document.getElementById('headerCartCount');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">Your cart is empty</p>';
        cartTotal.textContent = '$0.00';
        cartItemCount.textContent = '0';
        headerCartCount.textContent = '0';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price} x ${item.quantity}</div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemCount.textContent = totalItems;
    headerCartCount.textContent = totalItems;
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    alert('🎉 Thank you for your purchase! Total: ' + document.getElementById('cartTotal').textContent);
    cart = [];
    updateCart();
    toggleCart();
}

function addToWishlist(productId) {
    alert('❤️ Added to wishlist!');
}

function quickView(productId) {
    const product = products.find(p => p.id === productId);
    alert(`Quick View: ${product.name}\nPrice: $${product.price}`);
}

function subscribeNewsletter(event) {
    event.preventDefault();
    alert('✅ Thank you for subscribing!');
    event.target.reset();
}