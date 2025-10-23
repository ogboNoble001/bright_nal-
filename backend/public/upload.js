window.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== 'undefined') lucide.createIcons();

  const uploadForm = document.getElementById("uploadForm");
  const result = document.getElementById("result");
  const fileInput = document.querySelector('input[name="images"]');

  // Fetch products
  async function fetchAllUploads() {
    try {
      showPlaceholder();

      const res = await fetch("/upload/files");
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const products = await res.json();

      if (!products || products.length === 0) {
        result.innerHTML = '<p style="color: #888; text-align: center; padding: 2rem;">No products yet. Upload your first product!</p>';
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
              <div class="placeholder-line"></div>
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
        <div class="upload-card">
          <img src="${product.image_url}" alt="${product.product_name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23333%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 fill=%22%23666%22%3ENo Image%3C/text%3E%3C/svg%3E'"/>
          <div class="upload-info">
            <h3>${product.product_name}</h3>
            <p><strong>Category:</strong> <span>${product.category}</span></p>
            <p><strong>Brand:</strong> <span>${product.brand}</span></p>
            <p><strong>Price:</strong> <span>₦${parseFloat(product.price).toLocaleString()}</span></p>
            <p><strong>Stock:</strong> <span>${product.stock}</span></p>
            <p><strong>Class:</strong> <span>${product.product_class}</span></p>
            <p><strong>SKU:</strong> <span>${product.sku}</span></p>
            <p><strong>Sizes:</strong> <span>${product.sizes}</span></p>
            <p><strong>Colors:</strong> <span>${product.colors}</span></p>
          </div>
        </div>
      `;
    });
    html += '</div>';
    result.innerHTML = html;
  }

  // Show loader
  function showLoader() {
    result.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: #888;">
        <div style="width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
        <p>Uploading product...</p>
      </div>
    `;
  }

  // Form submission
  if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        showError("Please select an image to upload");
        return;
      }

      // Validate file size
      if (fileInput.files[0].size > 5 * 1024 * 1024) {
        showError("Image must be smaller than 5MB");
        return;
      }

      showLoader();

      try {
        const formData = new FormData(uploadForm);
        const response = await fetch("/upload", { 
          method: "POST", 
          body: formData 
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showSuccess("✓ Product uploaded successfully!");
          uploadForm.reset();
          setTimeout(fetchAllUploads, 1000);
        } else {
          showError(data.message || "Upload failed");
        }

      } catch (err) {
        console.error("❌ Upload error:", err);
        showError(`Upload failed: ${err.message}`);
      }
    });
  }

  // Helper functions
  function showError(message) {
    result.innerHTML = `
      <div style="color: #f44336; text-align: center; padding: 1rem; background: rgba(244, 67, 54, 0.1); border-radius: 8px; border: 1px solid rgba(244, 67, 54, 0.3);">
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