const products = [
      { id: 1, name: "Premium Wireless Headphones", category: "Audio", price: 299, originalPrice: 399, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop", badge: "$20", description: "Experience crystal-clear sound with advanced noise cancellation technology." },
      { id: 2, name: "Smart Watch Pro", category: "Wearables", price: 449, originalPrice: 599, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop", badge: "$30", description: "Track your fitness and stay connected with our latest smartwatch." },
      { id: 3, name: "Designer Sunglasses", category: "Fashion", price: 189, originalPrice: 249, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=500&fit=crop", badge: "$30", description: "UV protection with premium polarized lenses and iconic style." },
      { id: 4, name: "Leather Backpack", category: "Accessories", price: 129, originalPrice: 179, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop", badge: "$30", description: "Handcrafted genuine leather with spacious compartments." },
      { id: 5, name: "Minimalist Sneakers", category: "Footwear", price: 89, originalPrice: 129, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop", badge: "$30", description: "Comfortable everyday sneakers with premium materials." },
      { id: 6, name: "Vintage Camera", category: "Photography", price: 799, originalPrice: 999, image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&h=500&fit=crop", badge: "$30", description: "Classic design meets modern technology for stunning photos." },
      { id: 7, name: "Wireless Speaker", category: "Audio", price: 149, originalPrice: 199, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop", badge: "$30", description: "360° surround sound with 24-hour battery life." },
      { id: 8, name: "Gaming Mouse", category: "Tech", price: 79, originalPrice: 99, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop", badge: "$30", description: "Precision gaming with customizable RGB lighting." }
    ];

    let currentProduct = null;
    let quantity = 1;
    const tracks = ['track1', 'track2', 'track3', 'track4'];

    function createSkeletonCard() {
      return `
        <div class="product-card">
          <div class="image-container">
            <div class="skeleton-loader"></div>
          </div>
          <div class="card-content">
            <div class="skeleton-loader" style="height: 12px; width: 60%; margin-bottom: 0.5rem; border-radius: 4px;"></div>
            <div class="skeleton-loader" style="height: 16px; width: 80%; margin-bottom: 0.5rem; border-radius: 4px;"></div>
            <div class="skeleton-loader" style="height: 14px; width: 100%; margin-bottom: 0.5rem; border-radius: 4px;"></div>
            <div class="skeleton-loader" style="height: 14px; width: 70%; border-radius: 4px;"></div>
          </div>
        </div>
      `;
    }

    function createProductCard(product) {
      return `
        <div class="product-card" onclick="openModal(${product.id})">
          <div class="image-container">
            <div class="card-badge">${product.badge}</div>
            <img src="${product.image}" alt="${product.name}" class="product-image">
          </div>
          <div class="card-content">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-category">${product.category}</p>
            <div class="price-section">
              <span class="product-price">$${product.price}</span>
              <span class="product-original-price">$${product.originalPrice}</span>
            </div>
          </div>
        </div>
      `;
    }

    function initializeCarousels() {
      tracks.forEach(trackId => {
        const track = document.getElementById(trackId);
        for (let i = 0; i < 6; i++) track.innerHTML += createSkeletonCard();
      });
      
      setTimeout(() => {
        tracks.forEach((trackId, index) => {
          const track = document.getElementById(trackId);
          track.innerHTML = '';
          const startIndex = index * 2;
          const rowProducts = [...products.slice(startIndex), ...products.slice(0, startIndex)];
          rowProducts.forEach(product => track.innerHTML += createProductCard(product));
        });
      }, 1500);
    }

    function openModal(productId) {
      currentProduct = products.find(p => p.id === productId);
      quantity = 1;
      
      const modal = document.getElementById('modal-product');
      const expandedProduct = document.getElementById('expandedProduct');
      const discount = Math.round(((currentProduct.originalPrice - currentProduct.price) / currentProduct.originalPrice) * 100);
      
      expandedProduct.innerHTML = `
        <div>
          <img src="${currentProduct.image}" alt="${currentProduct.name}" class="expanded-image">
        </div>
        <div class="expanded-details">
          <div class="expanded-category">${currentProduct.category}</div>
          <h2 class="expanded-name">${currentProduct.name}</h2>
          <p class="expanded-description">${currentProduct.description}</p>
          <div class="expanded-price-section">
            <span class="expanded-current-price">$${currentProduct.price}</span>
            <span class="expanded-original-price">$${currentProduct.originalPrice}</span>
            <span class="discount-badge">-${discount}%</span>
          </div>
          <div class="quantity-selector">
            <span class="quantity-label">Quantity:</span>
            <div class="quantity-controls">
              <button class="qty-btn" onclick="changeQuantity(-1)">-</button>
              <span class="qty-display" id="qtyDisplay">1</span>
              <button class="qty-btn" onclick="changeQuantity(1)">+</button>
            </div>
          </div>
          <div class="action-buttons">
            <button class="add-to-cart-btn" onclick="addToCart()">Add to Cart - $${currentProduct.price}</button>
            <button class="wishlist-btn">♥</button>
          </div>
        </div>
      `;
      
      loadRelatedProducts(productId);
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      const modal = document.getElementById('modal-product');
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }

    function changeQuantity(delta) {
      quantity = Math.max(1, quantity + delta);
      document.getElementById('qtyDisplay').textContent = quantity;
      document.querySelector('.add-to-cart-btn').textContent = `Add to Cart - $${currentProduct.price * quantity}`;
    }

    function addToCart() {
      alert(`Added ${quantity} × ${currentProduct.name} to cart!`);
      closeModal();
    }

    function loadRelatedProducts(excludeId) {
      const relatedGrid = document.getElementById('relatedGrid');
      const related = products.filter(p => p.id !== excludeId && p.category === currentProduct.category).slice(0, 4);
      relatedGrid.innerHTML = related.map(product => `
        <div class="related-card" onclick="openModal(${product.id})">
          <img src="${product.image}" alt="${product.name}" class="related-image">
          <div class="related-info">
            <h4 class="related-name">${product.name}</h4>
            <p class="related-price">$${product.price}</p>
          </div>
        </div>
      `).join('');
    }

    function scrollCarousel(trackId, direction) {
      const track = document.getElementById(trackId);
      const cardWidth = track.querySelector('.product-card').offsetWidth + 24; // Including gap
      track.scrollBy({
        left: direction * cardWidth,
        behavior: 'smooth'
      });
      
      // Update arrows after scroll animation
      setTimeout(() => updateArrows(trackId), 300);
    }

    function updateArrows(trackId) {
      const track = document.getElementById(trackId);
      const wrapper = track.parentElement;
      const leftArrow = wrapper.querySelector('.arrow-left');
      const rightArrow = wrapper.querySelector('.arrow-right');
      
      if (leftArrow && rightArrow) {
        leftArrow.classList.toggle('visible', track.scrollLeft > 0);
        rightArrow.classList.toggle('visible', 
          track.scrollLeft < (track.scrollWidth - track.clientWidth - 1));
      }
    }

    document.getElementById('modal-product').addEventListener('click', e => {
      if (e.target === e.currentTarget) closeModal();
    });

    initializeCarousels();

    tracks.forEach(trackId => {
      const track = document.getElementById(trackId);
      track.addEventListener('scroll', () => updateArrows(trackId));
      
      // Initial arrow state
      setTimeout(() => updateArrows(trackId), 1600);
    });