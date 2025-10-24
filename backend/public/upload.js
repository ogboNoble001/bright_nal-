window.addEventListener("DOMContentLoaded", async () => {
    lucide.createIcons()
    const apiURL = "https://bright-nal-1.onrender.com/upload/files";
    
    try {
        const res = await fetch(apiURL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const products = await res.json();
        
        console.clear();
        console.log("=== All Products in Database ===");
        console.table(products); // nice formatted table view
        console.log(products); // full detailed view
    }
    catch (err) {
        console.error("Error fetching products:", err);
    }
});