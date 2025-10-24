window.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined") lucide.createIcons();
  
  const result = document.getElementById("result");
  const modalBox = document.getElementById("modalBoxForm");
  const toggleBtn = document.getElementById("toggleUpload");
  const closeBtn = document.getElementById("closeModal");
  const uploadForm = document.getElementById("uploadForm");
  const imageInput = document.getElementById("imageUpload");
  const fileLabel = document.querySelector(".custom-file-label span");
  
  // Toggle modal open
  toggleBtn?.addEventListener("click", () => {
    modalBox.classList.add("active");
    if (typeof lucide !== "undefined") lucide.createIcons();
  });
  
  // Toggle modal close
  closeBtn?.addEventListener("click", () => {
    modalBox.classList.remove("active");
    uploadForm.reset();
    fileLabel.textContent = "Select Image";
  });
  
  // Close modal on outside click
  modalBox?.addEventListener("click", (e) => {
    if (e.target === modalBox) {
      modalBox.classList.remove("active");
      uploadForm.reset();
      fileLabel.textContent = "Select Image";
    }
  });
  
  // Update file label when image selected
  imageInput?.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      fileLabel.textContent = file.name;
    } else {
      fileLabel.textContent = "Select Image";
    }
  });
  
  // Handle form submission
  uploadForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const formData = new FormData(uploadForm);
    const submitBtn = uploadForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Validate image
    if (!formData.get("images") || !formData.get("images").name) {
      alert("⚠️ Please select an image file");
      return;
    }
    
    submitBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Uploading...`;
    submitBtn.disabled = true;
    if (typeof lucide !== "undefined") lucide.createIcons();
    
    try {
      const res = await fetch("/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (data.success) {
        alert("✅ " + (data.message || "Product uploaded successfully!"));
        modalBox.classList.remove("active");
        uploadForm.reset();
        fileLabel.textContent = "Select Image";
        fetchUploads();
      } else {
        alert("❌ Upload failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Upload error: " + err.message);
    } finally {
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }
  });
  
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
  
  fetchUploads();
});