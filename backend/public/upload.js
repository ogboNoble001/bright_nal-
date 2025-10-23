window.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();

  const uploadForm = document.getElementById("uploadForm");
  const result = document.getElementById("result");
  const fileInput = document.querySelector('input[name="images"]');
  let editingProductId = null;

  // Fetch products
  async function fetchAllUploads() {
    try {
      showPlaceholder();

      const res = await fetch("/upload/files");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      const products = await res.json();

      if (!products || products.length === 0) {
        result.innerHTML = '<p style="color: #888; text-align: center; padding: 2rem;">No products yet!</p>';
        return;
      }

      displayProducts(products);

    } catch (err) {
      console.error("❌ Fetch error:", err);
      result.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: #f44336; background: rgba(244, 67, 54, 0.1); border-radius: 12px;">
          <p style="font-size: 1.2rem; margin-bottom: 0.5rem;">⚠️ Failed to load products</p>
          <p style="color: #888; font-size: 0.9rem;">${err.message}</p>
          <button onclick="location.reload()" style="margin-top: 1rem; padding: 0.6rem 1.5rem; background: #f44336; color: #fff; border: none; border-radius: 8px; cursor: pointer;">Retry</button>
        </div>
      `;
    }
  }

  // Show placeholder
  function showPlaceholder() {
    result.innerHTML = `
      <div class="uploads-grid">
        ${Array(3).fill().map(() => `
          <div class="placeholder-card">
            <div class="placeholder-img"></div>
            <div class="placeholder-content">
              <div class="placeholder-line"></div>
              <div class="placeholder-line short"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Display products
  function displayProducts(products) {
    let html = '<div class="uploads-grid">';
    products.forEach(product => {
      html += `
        <div class="upload-card" data-id="${product.id}">
          <img src="${product.image_url}" alt="${product.product_name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23333%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'"/>
          <div class="upload-info">
            <h3>${product.product_name}</h3>
            <p><strong>Category:</strong> <span>${product.category}</span></p>
            <p><strong>Brand:</strong> <span>${product.brand}</span></p>
            <p><strong>Price:</strong> <span>₦${parseFloat(product.price).toLocaleString()}</span></p>
            <p><strong>Stock:</strong> <span>${product.stock}</span></p>
            <p><strong>Class:</strong> <span>${product.product_class}</span></p>
            <p><strong>SKU:</strong> <span>${product.sku}</span></p>
          </div>
          <div class="card-actions">
            <button class="edit-btn" onclick="editProduct(${product.id}, ${JSON.stringify(product).replace(/"/g, '&quot;')})">
              <i data-lucide="edit"></i> Edit
            </button>
            <button class="delete-btn" onclick="deleteProduct(${product.id})">
              <i data-lucide="trash-2"></i> Delete
            </button>
          </div>
        </div>
      `;
    });
    html += '</div>';
    result.innerHTML = html;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Edit product
  window.editProduct = function(id, product) {
    editingProductId = id;
    
    document.querySelector('input[name="productName"]').value = product.product_name || '';
    document.querySelector('input[name="category"]').value = product.category || '';
    document.querySelector('input[name="brand"]').value = product.brand || '';
    document.querySelector('input[name="price"]').value = product.price || '';
    document.querySelector('input[name="stock"]').value = product.stock || '';
    document.querySelector('input[name="sku"]').value = product.sku || '';
    document.querySelector('input[name="productClass"]').value = product.product_class || '';
    document.querySelector('input[name="sizes"]').value = product.sizes || '';
    document.querySelector('input[name="colors"]').value = product.colors || '';

    // Change submit button text
    const submitBtn = uploadForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i data-lucide="save"></i> Update Product';
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // Scroll to form
    uploadForm.scrollIntoView({ behavior: 'smooth' });
  };

  // Delete product
  window.deleteProduct = async function(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/upload/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        showSuccess('✓ Product deleted successfully!');
        setTimeout(fetchAllUploads, 1000);
      } else {
        showError(data.message || 'Delete failed');
      }
    } catch (err) {
      console.error('❌ Delete error:', err);
      showError('Failed to delete product');
    }
  };

  // Show loader
  function showLoader() {
    result.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: #888;">
        <div style="width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
        <p>${editingProductId ? 'Updating' : 'Uploading'} product...</p>
      </div>
    `;
  }

  // Form submission
  if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // Only require file for new uploads
      if (!editingProductId && (!fileInput || !fileInput.files || fileInput.files.length === 0)) {
        showError("Please select an image to upload");
        return;
      }

      // Validate file size if new file selected
      if (fileInput.files && fileInput.files.length > 0 && fileInput.files[0].size > 5 * 1024 * 1024) {
        showError("Image must be smaller than 5MB");
        return;
      }

      showLoader();

      try {
        const formData = new FormData(uploadForm);
        const url = editingProductId ? `/upload/${editingProductId}` : '/upload';
        const method = editingProductId ? 'PUT' : 'POST';

        const response = await fetch(url, { 
          method: method, 
          body: formData 
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showSuccess(`✓ Product ${editingProductId ? 'updated' : 'uploaded'} successfully!`);
          uploadForm.reset();
          editingProductId = null;
          
          // Reset button text
          const submitBtn = uploadForm.querySelector('button[type="submit"]');
          submitBtn.innerHTML = '<i data-lucide="plus"></i> Add Product';
          if (typeof lucide !== 'undefined') lucide.createIcons();
          
          setTimeout(fetchAllUploads, 1000);
        } else {
          showError(data.message || 'Operation failed');
        }

      } catch (err) {
        console.error("❌ Error:", err);
        showError(`Operation failed: ${err.message}`);
      }
    });
  }

  // Helper functions
  function showError(message) {
    result.innerHTML = `
      <div style="color: #f44336; text-align: center; padding: 1rem; background: rgba(244, 67, 54, 0.1); border-radius: 8px; border: 1px solid rgba(244, 67, 54, 0.3); margin-bottom: 2rem;">
        ⚠️ ${message}
      </div>
    `;
  }

  function showSuccess(message) {
    result.innerHTML = `
      <div style="color: #4CAF50; text-align: center; padding: 1rem; background: rgba(76, 175, 80, 0.1); border-radius: 8px; margin-bottom: 2rem; border: 1px solid rgba(76, 175, 80, 0.3);">
        ${message}
      </div>
    `;
  }

  // Initial load
  fetchAllUploads();
});