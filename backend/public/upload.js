window.addEventListener("DOMContentLoaded", () => {
    if (typeof lucide !== "undefined") lucide.createIcons();
    
    const result = document.getElementById("result");
    
    const showPlaceholder = () => {
        result.innerHTML = `
      <div class="uploads-grid">
        ${Array(4)
          .fill()
          .map(
            () => `
              <div class="placeholder-card">
                <div class="placeholder-img"></div>
                <div class="placeholder-content">
                  <div class="placeholder-line"></div>
                  <div class="placeholder-line short"></div>
                </div>
              </div>`
          )
          .join("")}
      </div>
    `;
    };
    
    const showMessage = (msg, type = "error") => {
        const colors = {
            success: "#4CAF50",
            error: "#f44336",
            info: "#2196F3",
        };
        result.innerHTML = `
      <div style="color:${colors[type]}; text-align:center; padding:1rem;
        background:rgba(0,0,0,0.03); border:1px solid ${colors[type]}33;
        border-radius:8px; margin-top:2rem;">
        ${msg}
      </div>
    `;
    };
    
    async function fetchAllUploads() {
        try {
            showPlaceholder();
            const res = await fetch("/upload/files");
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const products = await res.json();
            
            if (!products.length) {
                result.innerHTML = `<p style="text-align:center;color:#888;padding:2rem;">No products yet!</p>`;
                return;
            }
            
            let html = '<div class="uploads-grid">';
            for (const product of products) {
                html += `
          <div class="upload-card">
            <img src="${product.image_url}" alt="${product.product_name}" 
              onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
            <div class="upload-info">
              <h3>${product.product_name || "Unnamed Product"}</h3>
              <p><strong>Category:</strong> ${product.category || "N/A"}</p>
              <p><strong>Brand:</strong> ${product.brand || "N/A"}</p>
              <p><strong>Price:</strong> ₦${product.price || "0"}</p>
              <p><strong>Stock:</strong> ${product.stock || "N/A"}</p>
            </div>
          </div>
        `;
            }
            html += "</div>";
            result.innerHTML = html;
            
            if (typeof lucide !== "undefined") lucide.createIcons();
        } catch (err) {
            console.error("Fetch error:", err);
            showMessage(`Failed to load products: ${err.message}`, "error");
        }
    }
    
    fetchAllUploads();
});