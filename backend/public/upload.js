window.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined") lucide.createIcons();

  const result = document.getElementById("result");
  const uploadForm = document.getElementById("uploadForm");
  const toggleUploadBtn = document.getElementById("toggleUpload");
  const modalBox = document.getElementById("modalBoxForm");
  const closeModal = document.getElementById("closeModal");
  let editingProductId = null; // Track if editing

  async function fetchUploads() {
    try {
      const res = await fetch("/upload/files");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const uploads = await res.json();

      if (!uploads.length) {
        result.innerHTML = `<p class="no-products">No uploads found.</p>`;
        return;
      }

      let html = '<div class="uploads-grid">';
      uploads.forEach((u) => {
        html += `
          <div class="upload-card" data-id="${u.id}">
            <img src="${u.image_url}" alt="${u.product_name}" 
                 onerror="this.src='https://via.placeholder.com/400x280?text=No+Image'">
            <div class="upload-info">
              <h3>${u.product_name || "Unnamed Product"}</h3>
              <p><strong>Category:</strong> ${u.category || "N/A"}</p>
              <p><strong>Brand:</strong> ${u.brand || "N/A"}</p>
              <p><strong>Price:</strong> ₦${u.price || "0.00"}</p>
              <p><strong>Stock:</strong> ${u.stock || "0"}</p>
            </div>
            <div class="card-actions">
              <button class="edit-btn" data-id="${u.id}">
                <i data-lucide="edit-3"></i> Edit
              </button>
              <button class="delete-btn" data-id="${u.id}">
                <i data-lucide="trash-2"></i> Delete
              </button>
            </div>
          </div>
        `;
      });
      html += "</div>";
      result.innerHTML = html;

      if (typeof lucide !== "undefined") lucide.createIcons();
      attachDeleteHandlers();
      attachEditHandlers();
    } catch (err) {
      console.error(err);
      result.innerHTML = `<p class="error">Failed to load uploads: ${err.message}</p>`;
    }
  }

  function attachDeleteHandlers() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        if (!confirm("Are you sure you want to delete this product?")) return;

        btn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Deleting...`;
        if (typeof lucide !== "undefined") lucide.createIcons();

        try {
          const res = await fetch(`/upload/${id}`, { method: "DELETE" });
          const data = await res.json();

          if (data.success) {
            alert("✅ Product deleted successfully!");
            fetchUploads();
          } else {
            alert("❌ Delete failed: " + (data.message || "Unknown error"));
          }
        } catch (err) {
          console.error(err);
          alert("Failed to delete product: " + err.message);
        }
      });
    });
  }

  function attachEditHandlers() {
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        try {
          const res = await fetch(`/upload/${id}`);
          const product = await res.json();

          // Populate form
          uploadForm.productName.value = product.product_name || "";
          uploadForm.category.value = product.category || "";
          uploadForm.brand.value = product.brand || "";
          uploadForm.price.value = product.price || "";
          uploadForm.stock.value = product.stock || "";
          uploadForm.sku.value = product.sku || "";
          uploadForm.productClass.value = product.product_class || "";
          uploadForm.sizes.value = product.sizes || "";
          uploadForm.colors.value = product.colors || "";
          uploadForm.description.value = product.description || "";

          editingProductId = id; // mark editing

          // Open modal
          modalBox.classList.add("active");
        } catch (err) {
          console.error(err);
          alert("Failed to fetch product data.");
        }
      });
    });
  }

  toggleUploadBtn.addEventListener("click", () => modalBox.classList.add("active"));
  closeModal.addEventListener("click", () => modalBox.classList.remove("active"));

  // Handle upload form submit
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(uploadForm);
    try {
      let url = "/upload";
      let method = "POST";

      if (editingProductId) {
        url += `/${editingProductId}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert(editingProductId ? "✅ Product updated!" : "✅ Product uploaded!");
        uploadForm.reset();
        editingProductId = null;
        modalBox.classList.remove("active");
        fetchUploads();
      } else {
        alert("❌ Failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Request failed: " + err.message);
    }
  });

  fetchUploads();
});
