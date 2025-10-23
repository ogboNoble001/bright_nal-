window.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined") lucide.createIcons();

  const uploadForm = document.getElementById("uploadForm");
  const toggleBtn = document.querySelector(".toggle-form-btn");
  const modalBox = document.getElementById("modalBoxForm");
  const closeModal = document.getElementById("closeModal");
  const result = document.getElementById("result");
  const fileInput = document.querySelector('input[name="images"]');
  
  let editingProductId = null;
  let allProducts = [];
  let showingAll = false;

  // Modal controls
  toggleBtn?.addEventListener("click", () => modalBox.classList.add("active"));
  closeModal?.addEventListener("click", () => {
    modalBox.classList.remove("active");
    uploadForm.reset();
    editingProductId = null;
  });

  // Utilities
  const showPlaceholder = () => {
    result.innerHTML = `<div class="uploads-grid">${Array(4).fill().map(() => 
      `<div class="placeholder-card"><div class="placeholder-img"></div><div class="placeholder-content">
      <div class="placeholder-line"></div><div class="placeholder-line short"></div></div></div>`
    ).join("")}</div>`;
  };

  const showMessage = (msg, type = "error") => {
    const colors = { success: "#4CAF50", error: "#f44336", info: "#2196F3" };
    result.innerHTML = `<div style="color:${colors[type]};text-align:center;padding:1rem;
      background:rgba(0,0,0,0.03);border:1px solid ${colors[type]}33;border-radius:8px;margin-bottom:1.5rem;">
      ${msg}</div>`;
  };

  const showLoader = (text = "Processing...") => {
    result.innerHTML = `<div style="text-align:center;padding:3rem;color:#888;">
      <div style="width:50px;height:50px;border:4px solid rgba(0,0,0,0.1);border-top-color:#000;
      border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 1rem;"></div><p>${text}</p></div>`;
  };

  // Fetch products
  async function fetchAllUploads() {
    try {
      showPlaceholder();
      const res = await fetch("/upload/files");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      allProducts = await res.json();
      if (!allProducts.length) {
        result.innerHTML = `<p style="text-align:center;color:#888;padding:2rem;">No products yet!</p>`;
        return;
      }
      renderProducts(allProducts.slice(0, 6), true);
    } catch (err) {
      showMessage(`Failed to load: ${err.message}`, "error");
    }
  }

  // Render products
  function renderProducts(products, showViewMore = false) {
    let html = '<div class="uploads-grid">';
    products.forEach(p => {
      html += `<div class="upload-card" data-id="${p.id}">
        <img src="${p.image_url}" alt="${p.product_name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23333%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'"/>
        <div class="upload-info">
          <h3>${p.product_name}</h3>
          <p><strong>Category:</strong> ${p.category}</p>
          <p><strong>Brand:</strong> ${p.brand}</p>
          <p><strong>Price:</strong> ₦${parseFloat(p.price).toLocaleString()}</p>
          <p><strong>Stock:</strong> ${p.stock}</p>
          <p><strong>Class:</strong> ${p.product_class}</p>
          <p><strong>SKU:</strong> ${p.sku}</p>
        </div>
        <div class="card-actions">
          <button class="edit-btn" data-id="${p.id}" data-product='${JSON.stringify(p)}'>
            <i data-lucide="edit"></i> Edit
          </button>
          <button class="delete-btn" data-id="${p.id}">
            <i data-lucide="trash-2"></i> Delete
          </button>
        </div>
      </div>`;
    });
    html += "</div>";

    if (showViewMore && allProducts.length > 6 && !showingAll) {
      html += `<div style="text-align:center;margin-top:1.5rem;">
        <button id="viewMoreBtn" style="padding:0.8rem 1.5rem;border:none;background:#000;
        color:#fff;border-radius:8px;cursor:pointer;font-weight:500;">View More</button></div>`;
    }

    result.innerHTML = html;
    if (typeof lucide !== "undefined") lucide.createIcons();
    attachHandlers();
  }

  // Attach handlers
  function attachHandlers() {
    document.querySelectorAll(".edit-btn").forEach(btn => 
      btn.addEventListener("click", () => {
        const product = JSON.parse(btn.getAttribute("data-product"));
        startEdit(btn.getAttribute("data-id"), product);
      })
    );
    document.querySelectorAll(".delete-btn").forEach(btn => 
      btn.addEventListener("click", () => deleteProduct(btn.getAttribute("data-id")))
    );
    document.getElementById("viewMoreBtn")?.addEventListener("click", () => {
      showingAll = true;
      renderProducts(allProducts);
    });
  }

  // Edit product
  function startEdit(id, product) {
    modalBox.classList.add("active");
    editingProductId = id;
    ["productName", "category", "brand", "price", "stock", "sku", "productClass", "sizes", "colors"]
      .forEach(f => document.querySelector(`input[name="${f}"]`).value = product[f] || "");
    uploadForm.querySelector('button[type="submit"]').innerHTML = '<i data-lucide="save"></i> Update Product';
    lucide.createIcons();
  }

  // Delete product
  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/upload/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        showMessage("✓ Deleted successfully!", "success");
        setTimeout(fetchAllUploads, 1000);
      } else showMessage(data.message || "Delete failed", "error");
    } catch (err) {
      showMessage("Failed to delete", "error");
    }
  }

  // Form submit
  uploadForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    if (!editingProductId && !fileInput.files?.length) {
      return showMessage("Please select an image", "error");
    }
    if (fileInput.files?.length && fileInput.files[0].size > 5 * 1024 * 1024) {
      return showMessage("Image must be < 5MB", "error");
    }

    showLoader(editingProductId ? "Updating..." : "Uploading...");

    try {
      const url = editingProductId ? `/upload/${editingProductId}` : "/upload";
      const method = editingProductId ? "PUT" : "POST";
      const res = await fetch(url, { method, body: new FormData(uploadForm) });
      const data = await res.json();

      if (res.ok && data.success) {
        showMessage(`✓ ${editingProductId ? "Updated" : "Uploaded"} successfully!`, "success");
        modalBox.classList.remove("active");
        uploadForm.reset();
        editingProductId = null;
        uploadForm.querySelector('button[type="submit"]').innerHTML = '<i data-lucide="plus"></i> Add Product';
        lucide.createIcons();
        setTimeout(fetchAllUploads, 800);
      } else showMessage(data.message || "Failed", "error");
    } catch (err) {
      showMessage(`Failed: ${err.message}`, "error");
    }
  });

  fetchAllUploads();
});