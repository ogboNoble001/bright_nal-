window.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== "undefined") lucide.createIcons();
  
  const result = document.getElementById("result");
  
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
            <img src="${u.image_url}" alt="${u.product_name}" onerror="this.src='https://via.placeholder.com/400x280?text=No+Image'">
            <div class="upload-info">
              <h3>${u.product_name || "Unnamed Product"}</h3>
              <p><strong>Category:</strong><span>${u.category || "N/A"}</span></p>
              <p><strong>Brand:</strong><span>${u.brand || "N/A"}</span></p>
              <p><strong>Price:</strong><span>₦${u.price || "0"}</span></p>
              <p><strong>Stock:</strong><span>${u.stock || "N/A"}</span></p>
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
        if (!confirm("Are you sure you want to delete this upload?")) return;
        
        btn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Deleting...`;
        if (typeof lucide !== "undefined") lucide.createIcons();
        
        try {
          const res = await fetch(`/upload/delete/${id}`, { method: "DELETE" });
          const data = await res.json();
          alert(data.message || "Upload deleted successfully!");
          fetchUploads();
        } catch (err) {
          console.error(err);
          alert("Failed to delete upload: " + err.message);
        }
      });
    });
  }
  
  fetchUploads();
});