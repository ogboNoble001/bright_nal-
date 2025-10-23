window.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined") lucide.createIcons();

  const uploadForm = document.getElementById("uploadForm");
  const result = document.getElementById("result");
  const fileInput = document.querySelector('input[name="images"]');

  // ---------------------------
  // Fetch all uploaded products
  // ---------------------------
  async function fetchAllUploads() {
    try {
      // Show placeholders while loading
      result.innerHTML = `
        <div class="uploads-grid">
          <div class="placeholder-card"><div class="placeholder-img"></div><div class="placeholder-content"><div class="placeholder-line"></div><div class="placeholder-line short"></div><div class="placeholder-line"></div></div></div>
          <div class="placeholder-card"><div class="placeholder-img"></div><div class="placeholder-content"><div class="placeholder-line"></div><div class="placeholder-line short"></div><div class="placeholder-line"></div></div></div>
          <div class="placeholder-card"><div class="placeholder-img"></div><div class="placeholder-content"><div class="placeholder-line"></div><div class="placeholder-line short"></div><div class="placeholder-line"></div></div></div>
        </div>
      `;

      const res = await fetch("/upload/files");
      if (!res.ok) throw new Error("Failed to fetch products");

      const products = await res.json();
      if (!products || products.length === 0) {
        result.innerHTML = '<p style="color: #888; text-align: center; padding: 2rem;">No products uploaded yet.</p>';
        return;
      }

      // Build product grid
      let html = '<div class="uploads-grid">';
      products.forEach(product => {
        html += `
          <div class="upload-card">
            <img src="${product.image_url}" alt="${product.product_name || 'Product'}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23333%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'"/>
            <div class="upload-info">
              <h3>${product.product_name || 'N/A'}</h3>
              <p><strong>Category:</strong> <span>${product.category || 'N/A'}</span></p>
              <p><strong>Brand:</strong> <span>${product.brand || 'N/A'}</span></p>
              <p><strong>Price:</strong> <span>₦${product.price || '0'}</span></p>
              <p><strong>Stock:</strong> <span>${product.stock || '0'}</span></p>
              <p><strong>Class:</strong> <span>${product.product_class || 'N/A'}</span></p>
              <p><strong>SKU:</strong> <span>${product.sku || 'N/A'}</span></p>
              <p><strong>Sizes:</strong> <span>${product.sizes || 'N/A'}</span></p>
              <p><strong>Colors:</strong> <span>${product.colors || 'N/A'}</span></p>
            </div>
          </div>
        `;
      });
      html += '</div>';
      result.innerHTML = html;

    } catch (err) {
      console.error("Fetch error:", err);
      result.innerHTML = `<p class="error" style="color: #f44336; text-align: center; padding: 1rem; background: rgba(244, 67, 54, 0.1); border-radius: 8px;">Error loading products: ${err.message}</p>`;
    }
  }

  // ---------------------------
  // Show loader during upload
  // ---------------------------
  function showLoader() {
    result.innerHTML = `
      <div style="text-align: center; padding: 3rem; color: #888;">
        <div style="width: 50px; height: 50px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
        <p>Uploading product...</p>
      </div>
    `;
  }

  // ---------------------------
  // Handle form submission
  // ---------------------------
  if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!fileInput.files || fileInput.files.length === 0) {
        result.innerHTML = '<p class="error" style="color: #f44336; text-align: center; padding: 1rem; background: rgba(244, 67, 54, 0.1); border-radius: 8px;">Please select an image to upload.</p>';
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

        if (data.success) {
          result.innerHTML = '<p class="success" style="color: #4CAF50; text-align: center; padding: 1rem; background: rgba(76, 175, 80, 0.1); border-radius: 8px; margin-bottom: 2rem;">✓ Product uploaded successfully!</p>';
          uploadForm.reset();
          setTimeout(() => fetchAllUploads(), 800);
        } else {
          result.innerHTML = `<p class="error" style="color: #f44336; text-align: center; padding: 1rem; background: rgba(244, 67, 54, 0.1); border-radius: 8px;">Error: ${data.message}</p>`;
        }
      } catch (err) {
        console.error("Upload error:", err);
        result.innerHTML = `<p class="error" style="color: #f44336; text-align: center; padding: 1rem; background: rgba(244, 67, 54, 0.1); border-radius: 8px;">Upload failed: ${err.message}</p>`;
      }
    });
  }

  // ---------------------------
  // Initial fetch
  // ---------------------------
  fetchAllUploads();
});
