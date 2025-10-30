// ---------- Global Variables ----------
let products = [];
let cart = [];
let displayedProductCount = 6;
const apiURL = "https://bright-nal-2qev.onrender.com";

// ---------- Color Theme ----------
const THEME = {
  primary: '#2c3e50',
  secondary: '#34495e',
  success: '#27ae60',
  danger: '#e74c3c',
  warning: '#f39c12',
  info: '#3498db',
  light: '#ecf0f1',
  dark: '#1a252f'
};

// ---------- Enhanced Modal System ----------
let modalElement;
let modalOverlay;

function initModal() {
  const body = document.querySelector("body");
  
  // Create overlay
  modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  modalOverlay.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 9998;
    animation: fadeIn 0.2s ease;
  `;
  
  // Create modal
  modalElement = document.createElement("div");
  modalElement.className = "modal-dialog";
  modalElement.style.cssText = `
    display: none;
    position: fixed;
    justify-content: center;
    align-items: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;
    max-width: 480px;
    width: 90%;
    animation: slideDown 0.3s ease;
  `;
  
  modalElement.innerHTML = `
    <div class="modal-content" style="
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    ">
      <div class="modal-header" style="
        padding: 24px 24px 20px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: space-between;
      ">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="modal-icon"></div>
          <h3 class="modal-title" style="
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: ${THEME.primary};
          "></h3>
        </div>
        <button class="modal-close-btn" style="
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: background 0.2s;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="modal-body" style="
        padding: 24px;
      ">
        <div class="modal-message" style="
          color: ${THEME.secondary};
          font-size: 15px;
          line-height: 1.6;
        "></div>
        <div class="modal-input-container" style="display: none; margin-top: 16px;"></div>
      </div>
      <div class="modal-footer" style="
        padding: 16px 24px;
        background: #f8f9fa;
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      "></div>
    </div>
  `;
  
  body.appendChild(modalOverlay);
  body.appendChild(modalElement);
  
  // Add animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translate(-50%, -60%);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%);
      }
    }
    .modal-close-btn:hover {
      background: rgba(0, 0, 0, 0.05) !important;
    }
  `;
  document.head.appendChild(style);
}

function closeModal() {
  modalElement.style.display = "none";
  modalOverlay.style.display = "none";
  document.body.style.overflow = "";
}

// Alert Modal
function showAlert(title, message, type = "info") {
  const icons = {
    success: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${THEME.success}" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M8 12l2 2 4-4"></path>
    </svg>`,
    error: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${THEME.danger}" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="15" y1="9" x2="9" y2="15"></line>
      <line x1="9" y1="9" x2="15" y2="15"></line>
    </svg>`,
    warning: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${THEME.warning}" stroke-width="2">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>`,
    info: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${THEME.info}" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>`
  };
  
  const iconEl = modalElement.querySelector(".modal-icon");
  const titleEl = modalElement.querySelector(".modal-title");
  const messageEl = modalElement.querySelector(".modal-message");
  const inputContainer = modalElement.querySelector(".modal-input-container");
  const footer = modalElement.querySelector(".modal-footer");
  
  iconEl.innerHTML = icons[type] || icons.info;
  titleEl.textContent = title;
  messageEl.textContent = message;
  inputContainer.style.display = "none";
  
  footer.innerHTML = `
    <button class="modal-btn modal-ok" style="
      padding: 10px 24px;
      background: ${THEME.primary};
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    ">OK</button>
  `;
  
  modalOverlay.style.display = "block";
  modalElement.style.display = "flex";
  document.body.style.overflow = "hidden";
  
  const okBtn = footer.querySelector(".modal-ok");
  okBtn.onmouseover = () => okBtn.style.background = THEME.secondary;
  okBtn.onmouseout = () => okBtn.style.background = THEME.primary;
  okBtn.onclick = closeModal;
  
  modalElement.querySelector(".modal-close-btn").onclick = closeModal;
  modalOverlay.onclick = closeModal;
}

// Confirm Modal
function showConfirm(title, message, onConfirm, onCancel) {
  const iconEl = modalElement.querySelector(".modal-icon");
  const titleEl = modalElement.querySelector(".modal-title");
  const messageEl = modalElement.querySelector(".modal-message");
  const inputContainer = modalElement.querySelector(".modal-input-container");
  const footer = modalElement.querySelector(".modal-footer");
  
  iconEl.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${THEME.warning}" stroke-width="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>`;
  titleEl.textContent = title;
  messageEl.textContent = message;
  inputContainer.style.display = "none";
  
  footer.innerHTML = `
    <button class="modal-btn modal-cancel" style="
      padding: 10px 24px;
      background: transparent;
      color: ${THEME.secondary};
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    ">Cancel</button>
    <button class="modal-btn modal-confirm" style="
      padding: 10px 24px;
      background: ${THEME.primary};
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    ">Confirm</button>
  `;
  
  modalOverlay.style.display = "block";
  modalElement.style.display = "flex";
  document.body.style.overflow = "hidden";
  
  const cancelBtn = footer.querySelector(".modal-cancel");
  const confirmBtn = footer.querySelector(".modal-confirm");
  
  cancelBtn.onmouseover = () => cancelBtn.style.background = "#f5f5f5";
  cancelBtn.onmouseout = () => cancelBtn.style.background = "transparent";
  confirmBtn.onmouseover = () => confirmBtn.style.background = THEME.secondary;
  confirmBtn.onmouseout = () => confirmBtn.style.background = THEME.primary;
  
  cancelBtn.onclick = () => {
    closeModal();
    if (onCancel) onCancel();
  };
  
  confirmBtn.onclick = () => {
    closeModal();
    if (onConfirm) onConfirm();
  };
  
  modalElement.querySelector(".modal-close-btn").onclick = () => {
    closeModal();
    if (onCancel) onCancel();
  };
  
  modalOverlay.onclick = () => {
    closeModal();
    if (onCancel) onCancel();
  };
}

// Prompt Modal
function showPrompt(title, message, placeholder = "", onConfirm, onCancel) {
  const iconEl = modalElement.querySelector(".modal-icon");
  const titleEl = modalElement.querySelector(".modal-title");
  const messageEl = modalElement.querySelector(".modal-message");
  const inputContainer = modalElement.querySelector(".modal-input-container");
  const footer = modalElement.querySelector(".modal-footer");
  
  iconEl.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${THEME.info}" stroke-width="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>`;
  titleEl.textContent = title;
  messageEl.textContent = message;
  
  inputContainer.style.display = "block";
  inputContainer.innerHTML = `
    <input type="text" class="modal-input" placeholder="${placeholder}" style="
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      transition: all 0.2s;
      box-sizing: border-box;
    ">
  `;
  
  footer.innerHTML = `
    <button class="modal-btn modal-cancel" style="
      padding: 10px 24px;
      background: transparent;
      color: ${THEME.secondary};
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    ">Cancel</button>
    <button class="modal-btn modal-submit" style="
      padding: 10px 24px;
      background: ${THEME.primary};
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    ">Submit</button>
  `;
  
  modalOverlay.style.display = "block";
  modalElement.style.display = "flex";
  document.body.style.overflow = "hidden";
  
  const input = inputContainer.querySelector(".modal-input");
  const cancelBtn = footer.querySelector(".modal-cancel");
  const submitBtn = footer.querySelector(".modal-submit");
  
  input.onfocus = () => input.style.borderColor = THEME.primary;
  input.onblur = () => input.style.borderColor = "#ddd";
  
  cancelBtn.onmouseover = () => cancelBtn.style.background = "#f5f5f5";
  cancelBtn.onmouseout = () => cancelBtn.style.background = "transparent";
  submitBtn.onmouseover = () => submitBtn.style.background = THEME.secondary;
  submitBtn.onmouseout = () => submitBtn.style.background = THEME.primary;
  
  const handleSubmit = () => {
    const value = input.value.trim();
    closeModal();
    if (onConfirm) onConfirm(value);
  };
  
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSubmit();
  });
  
  cancelBtn.onclick = () => {
    closeModal();
    if (onCancel) onCancel();
  };
  
  submitBtn.onclick = handleSubmit;
  
  modalElement.querySelector(".modal-close-btn").onclick = () => {
    closeModal();
    if (onCancel) onCancel();
  };
  
  modalOverlay.onclick = () => {
    closeModal();
    if (onCancel) onCancel();
  };
  
  setTimeout(() => input.focus(), 100);
}

// ---------- Enhanced Placeholders ----------
function showPlaceholders(count = 6) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = Array.from({ length: count })
    .map(
      () => `
        <div class="placeholder-card" style="
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        ">
            <div class="placeholder-img" style="
              width: 100%;
              height: 300px;
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: shimmer 1.5s infinite;
            "></div>
            <div class="placeholder-content" style="padding: 20px;">
                <div class="placeholder-line" style="
                  height: 16px;
                  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                  background-size: 200% 100%;
                  animation: shimmer 1.5s infinite;
                  border-radius: 4px;
                  margin-bottom: 12px;
                "></div>
                <div class="placeholder-line short" style="
                  height: 16px;
                  width: 60%;
                  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                  background-size: 200% 100%;
                  animation: shimmer 1.5s infinite;
                  border-radius: 4px;
                  margin-bottom: 12px;
                "></div>
                <div class="placeholder-line" style="
                  height: 20px;
                  width: 40%;
                  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                  background-size: 200% 100%;
                  animation: shimmer 1.5s infinite;
                  border-radius: 4px;
                "></div>
            </div>
        </div>
    `
    )
    .join("");
  
  // Add shimmer animation if not exists
  if (!document.getElementById('shimmer-style')) {
    const style = document.createElement('style');
    style.id = 'shimmer-style';
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

// ---------- Fetch Products ----------
async function fetchProducts() {
  showPlaceholders(6);

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
      rating: item.rating || Math.floor(Math.random() * 5 + 1),
    }));

    renderProducts();
  } catch (err) {
    console.error("Failed to fetch products:", err);
    const grid = document.getElementById("productGrid");
    if (grid) {
      grid.innerHTML = `
        <div style="
          grid-column: 1/-1;
          text-align: center;
          padding: 60px 20px;
          color: ${THEME.secondary};
        ">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="${THEME.danger}" stroke-width="2" style="margin-bottom: 20px;">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <h3 style="margin: 0 0 8px 0; font-size: 20px; color: ${THEME.primary};">Unable to Load Products</h3>
          <p style="margin: 0; color: ${THEME.secondary};">Please check your connection and try again.</p>
        </div>
      `;
    }
  }
}

// ---------- Render Products ----------
function renderProducts(showAll = false) {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  const productsToShow = showAll ? products : products.slice(0, displayedProductCount);

  grid.innerHTML = productsToShow
    .map(
      (product) => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${
                  product.badge
                    ? `<div class="product-badges"><span class="badge ${product.productClass}">${product.badge.toUpperCase()}</span></div>`
                    : ""
                }
                <div class="product-actions">
                    <button class="action-btn" onclick="addToWishlist(${product.id})" title="Add to Wishlist">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark-icon">
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                        </svg>
                    </button>
                </div>
                <div class="product-overlay">
                    <div class="overlay-text"><strong>${product.category}</strong></div>
                    <div class="overlay-text">• <b>N/A</b> purchases</div>
                </div>
            </div>
            <div class="product-details">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    <span class="current-price">₦${product.price.toLocaleString()}</span>
                    ${
                      product.originalPrice
                        ? `<span class="original-price">₦${product.originalPrice.toLocaleString()}</span>`
                        : ""
                    }
                </div>
                <div class="product-rating">
                    <span><i>No reviews yet</i></span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `
    )
    .join("");

  if (!showAll && products.length > displayedProductCount) {
    const viewMoreBtn = document.createElement('div');
    viewMoreBtn.style.cssText = 'grid-column: 1/-1; text-align: center; margin: 2rem 0;';
    viewMoreBtn.innerHTML = `
      <button onclick="viewMoreProducts()" style="
        padding: 14px 40px;
        background: ${THEME.primary};
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s;
        box-shadow: 0 2px 8px rgba(44, 62, 80, 0.2);
      " onmouseover="this.style.background='${THEME.secondary}'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(44, 62, 80, 0.3)'" 
         onmouseout="this.style.background='${THEME.primary}'; this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(44, 62, 80, 0.2)'">
        View More Products (${products.length - displayedProductCount} remaining)
      </button>
    `;
    grid.appendChild(viewMoreBtn);
  }

  updateProductLength(products.length);
}

// ---------- View More Products ----------
function viewMoreProducts() {
  renderProducts(true);
}

// ---------- Update Product Length ----------
function updateProductLength(count) {
  const productLengthElements = document.querySelectorAll(".productLength");
  productLengthElements.forEach((element) => {
    element.textContent = count;
  });
}

// ---------- Enhanced Search Function ----------
function handleSearch() {
  const query = document.getElementById("searchInput").value.trim().toLowerCase();
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  if (!query) {
    renderProducts();
    return;
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
  );

  if (!filtered.length) {
    grid.innerHTML = `
      <div style="
        grid-column: 1/-1;
        text-align: center;
        padding: 60px 20px;
        color: ${THEME.secondary};
      ">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="${THEME.info}" stroke-width="2" style="margin-bottom: 20px;">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3 style="margin: 0 0 8px 0; font-size: 20px; color: ${THEME.primary};">No Products Found</h3>
        <p style="margin: 0; color: ${THEME.secondary};">We couldn't find any products matching "<strong>${query}</strong>"</p>
      </div>
    `;
    updateProductLength(0);
    return;
  }

  grid.innerHTML = filtered
    .map(
      (product) => `
        <div class="product-card">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${
                  product.badge
                    ? `<div class="product-badges"><span class="badge ${product.productClass}">${product.badge.toUpperCase()}</span></div>`
                    : ""
                }
                <div class="product-actions">
                    <button class="action-btn" onclick="addToWishlist(${product.id})" title="Add to Wishlist">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bookmark-icon">
                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                        </svg>
                    </button>
                </div>
                <div class="product-overlay">
                    <div class="overlay-text"><strong>${product.category}</strong></div>
                    <div class="overlay-text">• <b>N/A</b> purchases</div>
                </div>
            </div>
            <div class="product-details">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">
                    <span class="current-price">₦${product.price.toLocaleString()}</span>
                    ${
                      product.originalPrice
                        ? `<span class="original-price">₦${product.originalPrice.toLocaleString()}</span>`
                        : ""
                    }
                </div>
                <div class="product-rating">
                    <span><i>No reviews yet</i></span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `
    )
    .join("");

  updateProductLength(filtered.length);
}

// ---------- Cart Functions ----------
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;
  
  const existingItem = cart.find((item) => item.id === productId);
  if (existingItem) existingItem.quantity++;
  else cart.push({ ...product, quantity: 1 });
  
  updateCart();
  showAlert("Added to Cart", `${product.name} has been added to your cart successfully.`, "success");
}

function removeFromCart(productId) {
  const product = cart.find((item) => item.id === productId);
  if (!product) return;
  
  showConfirm(
    "Remove Item",
    `Are you sure you want to remove "${product.name}" from your cart?`,
    () => {
      cart = cart.filter((item) => item.id !== productId);
      updateCart();
      showAlert("Item Removed", "The item has been removed from your cart.", "info");
    }
  );
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const cartItemCount = document.getElementById("cartItemCount");
  const headerCartCount = document.getElementById("headerCartCount");

  if (!cart.length) {
    cartItems.innerHTML = `
      <div style="
        text-align: center;
        padding: 60px 20px;
        color: ${THEME.secondary};
      ">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="${THEME.secondary}" stroke-width="2" style="margin-bottom: 20px;">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <h3 style="margin: 0 0 8px 0; font-size: 18px; color: ${THEME.primary};">Your Cart is Empty</h3>
        <p style="margin: 0; color: ${THEME.secondary};">Add some products to get started!</p>
      </div>
    `;
    cartTotal.textContent = "₦0";
    cartItemCount.textContent = "0";
    headerCartCount.textContent = "0";
    headerCartCount.style.display = "none";
    return;
  }

  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price flex-row diff1">₦${item.price.toLocaleString()}<sup class="smaller">×${item.quantity}</sup></div>
                <div class="cart-item-subtotal"><u>₦${(item.price * item.quantity).toLocaleString()}</u></div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `₦${total.toLocaleString()}`;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartItemCount.textContent = totalItems;
  headerCartCount.textContent = totalItems;
  headerCartCount.style.display = "flex";
}

function toggleCart() {
  document.getElementById("cartSidebar").classList.toggle("active");
  document.querySelector(".cart-overlay").classList.toggle("active");
}

function checkout() {
  if (!cart.length) {
    showAlert("Cart Empty", "Your cart is empty! Please add items before checkout.", "warning");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  showPrompt(
    "Enter Email Address",
    "Please provide your email address to proceed with payment:",
    "your.email@example.com",
    (email) => {
      if (!email || !email.includes("@")) {
        showAlert("Invalid Email", "Please enter a valid email address to proceed.", "error");
        return;
      }

      if (typeof PaystackPop === 'undefined') {
        showAlert("Payment Error", "Payment system is currently unavailable. Please try again later.", "error");
        return;
      }

      let handler = PaystackPop.setup({
        key: "pk_test_063ca1f5e8ab353d84401b69b6693f62b2e15860",
        email: email,
        amount: total * 100,
        currency: "NGN",
        ref: "REF_" + Math.floor(Math.random() * 1000000000),
        callback: function (response) {
          fetch("https://bright-nal-2qev.onrender.com/api/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reference: response.reference })
          })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              showAlert("Payment Successful", "Thank you for your order! Your payment has been processed successfully.", "success");
              cart = [];
              updateCart();
              toggleCart();
            } else {
              showAlert("Verification Failed", "Payment verification failed. Please contact support for assistance.", "error");
            }
          })
          .catch(err => {
            console.error("Verification error:", err);
            showAlert("Connection Error", "Unable to verify payment. Please contact support.", "error");
          });
        },
        onClose: function () {
          console.log("Payment window closed.");
        },
      });

      handler.openIframe();
    }
  );
}

function addToWishlist(productId) {
  const product = products.find((p) => p.id === productId);
  if (product) {
    showAlert("Added to Wishlist", `${product.name} has been added to your wishlist!`, "success");
  }
}

function subscribeNewsletter(event) {
  event.preventDefault();
  const emailInput = event.target.querySelector('input[type="email"]');
  const email = emailInput?.value || "";
  
  if (!email || !email.includes("@")) {
    showAlert("Invalid Email", "Please enter a valid email address.", "error");
    return;
  }
  
  showAlert("Successfully Subscribed", "Thank you for subscribing to our newsletter! You'll receive updates on new collections and exclusive offers.", "success");
  event.target.reset();
}

// ---------- Enhanced Placeholder Animation System ----------
let placeholderAnimationInterval;
let currentPlaceholderIndex = 0;
let isSearchBarActive = false;
let hasUserTyped = false;

const placeholders = [
  "Search elegant suits and formal wears...",
  "Find trendy traditional outfits...",
  "Discover new fashion collections...",
  "Explore styles for every season...",
];

function startPlaceholderAnimation() {
  const placeholder = document.getElementById("animatedPlaceholder");
  if (!placeholder) return;
  
  // Clear any existing interval
  if (placeholderAnimationInterval) {
    clearInterval(placeholderAnimationInterval);
  }
  
  const changePlaceholder = () => {
    // Only animate if user hasn't typed and search bar is visible
    if (!hasUserTyped && placeholder.style.display !== "none") {
      placeholder.classList.remove("animate");
      void placeholder.offsetWidth; // Force reflow
      placeholder.classList.add("animate");
      placeholder.textContent = placeholders[currentPlaceholderIndex];
      currentPlaceholderIndex = (currentPlaceholderIndex + 1) % placeholders.length;
    }
  };
  
  changePlaceholder();
  placeholderAnimationInterval = setInterval(changePlaceholder, 3000);
}

function stopPlaceholderAnimation() {
  if (placeholderAnimationInterval) {
    clearInterval(placeholderAnimationInterval);
    placeholderAnimationInterval = null;
  }
}

// ---------- Initialize on Load ----------
window.addEventListener("load", () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  initModal();

  // ---------- Dropdown & Sidebar ----------
  const dropdownWrappers = document.querySelectorAll(".dropdown-wrapper");
  dropdownWrappers.forEach((wrapper) => {
    const menu = wrapper.querySelector(".dropdown-menu");
    wrapper.addEventListener("mouseenter", () => menu.classList.add("show"));
    wrapper.addEventListener("mouseleave", () => menu.classList.remove("show"));
  });

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileSidebar = document.querySelector(".mobile-sidebar");
  const sidebarOverlay = document.querySelector(".sidebar-overlay");
  const closeSidebar = document.querySelector(".close-sidebar");

  const openSidebar = () => {
    mobileSidebar.classList.add("active");
    sidebarOverlay.classList.add("active");
    menuToggle.classList.add("active");
    document.body.style.overflow = "hidden";
  };

  const closeSidebarFunc = () => {
    mobileSidebar.classList.remove("active");
    sidebarOverlay.classList.remove("active");
    menuToggle.classList.remove("active");
    document.body.style.overflow = "";
  };

  menuToggle?.addEventListener("click", () =>
    mobileSidebar.classList.contains("active") ? closeSidebarFunc() : openSidebar()
  );
  closeSidebar?.addEventListener("click", closeSidebarFunc);
  sidebarOverlay?.addEventListener("click", closeSidebarFunc);

  document.querySelectorAll(".mobile-nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const dropdown = item.nextElementSibling;
      if (dropdown?.classList.contains("mobile-dropdown")) {
        item.classList.toggle("expanded");
        dropdown.classList.toggle("expanded");
      }
    });
  });

  // ---------- Header Scroll ----------
  const header = document.querySelector(".header");
  let lastScroll = 0;
  
  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 10) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    
    lastScroll = currentScroll;
  });

  // ---------- Enhanced Search Placeholder Logic ----------
  const searchBar = document.getElementById("searchInputBar");
  const searchInput = document.getElementById("searchInput");
  const placeholder = document.getElementById("animatedPlaceholder");

  if (searchInput && placeholder) {
    // Handle input changes
    searchInput.addEventListener("input", () => {
      if (searchInput.value.length > 0) {
        hasUserTyped = true;
        placeholder.style.display = "none";
        stopPlaceholderAnimation();
      } else {
        hasUserTyped = false;
        placeholder.style.display = "block";
        startPlaceholderAnimation();
      }
    });

    // Handle focus
    searchInput.addEventListener("focus", () => {
      if (!hasUserTyped) {
        placeholder.style.display = "block";
      }
    });

    // Handle blur
    searchInput.addEventListener("blur", () => {
      if (!hasUserTyped) {
        placeholder.style.display = "block";
      }
    });
  }

  // ---------- Mobile Search Bar Toggle with Fixed Placeholder ----------
  function handleSearchBarClick(e) {
    if (window.innerWidth <= 1088) {
      if (!searchBar.classList.contains("active")) {
        e.preventDefault();
        e.stopPropagation();
        isSearchBarActive = true;
        searchBar.classList.add("active");
        searchInput.style.display = "block";
        
        // Only show placeholder if user hasn't typed
        if (!hasUserTyped && placeholder) {
          placeholder.style.display = "block";
          startPlaceholderAnimation();
        }
        
        setTimeout(() => searchInput.focus(), 100);
      }
    }
  }

  function handleClickOutside(e) {
    if (window.innerWidth <= 1088) {
      if (!searchBar.contains(e.target) && searchBar.classList.contains("active")) {
        isSearchBarActive = false;
        searchBar.classList.remove("active");
        searchInput.style.display = "none";
        
        // Keep placeholder hidden if user has typed
        if (!hasUserTyped && placeholder) {
          placeholder.style.display = "none";
          stopPlaceholderAnimation();
        }
      }
    }
  }

  searchBar?.addEventListener("click", handleSearchBarClick);
  document.addEventListener("click", handleClickOutside);

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1088) {
      isSearchBarActive = false;
      searchBar.classList.remove("active");
      searchInput.style.display = "block";
      
      if (!hasUserTyped && placeholder) {
        placeholder.style.display = "block";
        startPlaceholderAnimation();
      }
    } else if (!searchBar.classList.contains("active")) {
      searchInput.style.display = "none";
      if (placeholder) {
        placeholder.style.display = "none";
        stopPlaceholderAnimation();
      }
    }
  });

  // Initialize placeholder visibility
  if (window.innerWidth <= 1088 && !searchBar.classList.contains("active")) {
    searchInput.style.display = "none";
    if (placeholder) {
      placeholder.style.display = "none";
    }
  } else {
    if (!hasUserTyped && placeholder) {
      placeholder.style.display = "block";
      startPlaceholderAnimation();
    }
  }

  // ---------- Intro Tagline Animation ----------
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

  // ---------- Tabs ----------
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
    });
  });

  // ---------- Fetch Products ----------
  fetchProducts();

  // ---------- Attach Search Event with Debounce ----------
  let searchTimeout;
  searchInput?.addEventListener("keyup", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(handleSearch, 300);
  });
  
  // ---------- Cart Overlay Close ----------
  document.querySelector(".cart-overlay")?.addEventListener("click", toggleCart);
});