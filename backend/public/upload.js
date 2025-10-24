window.addEventListener("DOMContentLoaded", async () => {
    if (typeof lucide !== "undefined") lucide.createIcons();
    
    const apiURL = "https://bright-nal-1.onrender.com/upload/files";
    const resultBox = document.getElementById("result");
    
    // show loading placeholder
    resultBox.innerHTML = `
    <div class="loading-text">Loading products...</div>
  `;
    
    try {
        const res = await fetch(apiURL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        
        const products = await res.json();
        
        // If empty
        if (!products.length) {
            resultBox.innerHTML = `<p class="no-products">No products found.</p>`;
            return;
        }
        
        // Create product grid
        const productHTML = products
            .map(
                (p) => `
        <div class="product-card">
          <img src="${p.image_url}" alt="${p.product_name}" class="product-img">
          <div class="product-info">
            <h3 class="product-name">${p.product_name}</h3>
            <p class="product-meta">${p.category} | ${p.brand}</p>
            <p class="product-price">$${p.price}</p>
          </div>
        </div>
      `
            )
            .join("");
        
        resultBox.innerHTML = `
      <div class="product-grid">
        ${productHTML}
      </div>
    `;
        
        lucide.createIcons();
    } catch (err) {
        console.error("Error fetching products:", err);
        resultBox.innerHTML = `<p class="error-text">Failed to load products.</p>`;
    }
});