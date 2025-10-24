window.addEventListener("DOMContentLoaded", () => {
  const displaySection = document.querySelector(".product-display");

  async function fetchProducts() {
    try {
      const response = await fetch("https://bright-nal-1.onrender.com/upload/files");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const products = await response.json();

      displaySection.innerHTML = "";

      if (!products.length) {
        displaySection.innerHTML = "<p class='no-products'>No products found.</p>";
        return;
      }

      products.forEach((p) => {
        const card = document.createElement("div");
        card.classList.add("product-card");
        card.innerHTML = `
          <div class="product-image">
            <img src="${p.image_url}" alt="${p.product_name}">
          </div>
          <div class="product-info">
            <h3>${p.product_name}</h3>
            <p class="category">${p.category || "Uncategorized"}</p>
            <p class="brand">${p.brand || "Unknown"}</p>
            <p class="price">₦${p.price || 0}</p>
          </div>
        `;
        displaySection.appendChild(card);
      });
    } catch (error) {
      console.error("Fetch error:", error);
      displaySection.innerHTML = "<p class='error'>Failed to load products.</p>";
    }
  }

  fetchProducts();
});
