window.addEventListener("DOMContentLoaded", () => {
    if (typeof lucide !== "undefined") lucide.createIcons();
    
    const uploadForm = document.getElementById("uploadForm");
    const toggleBtn = document.querySelector(".toggle-form-btn");
    const modalBox = document.getElementById("modalBoxForm");
    const closeModal = document.getElementById("closeModal");
    const result = document.getElementById("result");
    const fileInput = document.querySelector('input[name="images"]');
    
    // Global state variables
    let editingProductId = null;
    let allProducts = [];
    let showingAll = false;
    
    // === MODAL HANDLERS ===
    if (toggleBtn && modalBox) {
        toggleBtn.addEventListener("click", () => {
            editingProductId = null;
            uploadForm.reset();
            const btn = uploadForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<i data-lucide="plus"></i> Add Product';
            lucide.createIcons();
            modalBox.classList.add("active");
        });
    }
    
    if (closeModal && modalBox) {
        closeModal.addEventListener("click", () => {
            modalBox.classList.remove("active");
            uploadForm.reset();
            editingProductId = null;
            const btn = uploadForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<i data-lucide="plus"></i> Add Product';
            lucide.createIcons();
        });
    }
    
    // === UTILITIES ===
    const showPlaceholder = () => {
        result.innerHTML = `
            <div class="uploads-grid">
                ${Array(4)
                    .fill()
                    .map(() => `
                        <div class="placeholder-card">
                            <div class="placeholder-img"></div>
                            <div class="placeholder-content">
                                <div class="placeholder-line"></div>
                                <div class="placeholder-line short"></div>
                            </div>
                        </div>
                    `)
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
                border-radius:8px; margin-bottom:1.5rem;">
                ${msg}
            </div>
        `;
    };
    
    const showLoader = (text = "Processing...") => {
        result.innerHTML = `
            <div style="text-align:center; padding:3rem; color:#888;">
                <div style="width:50px;height:50px;border:4px solid rgba(0,0,0,0.1);
                border-top-color:#000;border-radius:50%;animation:spin 1s linear infinite;
                margin:0 auto 1rem;"></div>
                <p>${text}</p>
            </div>
        `;
    };
    
    // === FETCH & DISPLAY ===
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
            console.error("Fetch error:", err);
            showMessage(`Failed to load products: ${err.message}`, "error");
        }
    }
    
    function renderProducts(products, showViewMore = false) {
        let html = '<div class="uploads-grid">';
        
        for (const product of products) {
            html += `
                <div class="upload-card" data-id="${product.id}">
                    <img src="${product.image_url}" alt="${product.product_name}"
                        onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23333%22 width=%22100%22 height=%22100%22/%3E%3C/svg%3E'"/>
                    <div class="upload-info">
                        <h3>${product.product_name}</h3>
                        <p><strong>Category:</strong> ${product.category}</p>
                        <p><strong>Brand:</strong> ${product.brand}</p>
                        <p><strong>Price:</strong> ₦${parseFloat(product.price).toLocaleString()}</p>
                        <p><strong>Stock:</strong> ${product.stock}</p>
                        <p><strong>Class:</strong> ${product.product_class}</p>
                        <p><strong>SKU:</strong> ${product.sku}</p>
                    </div>
                    <div class="card-actions">
                        <button class="edit-btn" data-id="${product.id}">
                            <i data-lucide="edit"></i> Edit
                        </button>
                        <button class="delete-btn" data-id="${product.id}">
                            <i data-lucide="trash-2"></i> Delete
                        </button>
                    </div>
                </div>
            `;
        }
        
        html += "</div>";
        
        if (showViewMore && allProducts.length > 6 && !showingAll) {
            html += `
                <div style="text-align:center; margin-top:1.5rem;">
                    <button id="viewMoreBtn" style="padding:0.8rem 1.5rem; border:none; 
                    background:#000; color:#fff; border-radius:8px; cursor:pointer; 
                    font-weight:500; transition:all .3s;">
                        View More
                    </button>
                </div>
            `;
        }
        
        result.innerHTML = html;
        if (typeof lucide !== "undefined") lucide.createIcons();
        
        attachHandlers();
    }
    
    function attachHandlers() {
        // Edit button handlers
        document.querySelectorAll(".edit-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const product = allProducts.find(p => p.id === id);
                if (product) {
                    startEdit(id, product);
                } else {
                    console.error("Product not found:", id);
                    showMessage("Product not found", "error");
                }
            });
        });
        
        // Delete button handlers
        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                deleteProduct(btn.getAttribute("data-id"));
            });
        });
        
        // View more button handler
        const viewMoreBtn = document.getElementById("viewMoreBtn");
        if (viewMoreBtn) {
            viewMoreBtn.addEventListener("click", () => {
                showingAll = true;
                renderProducts(allProducts);
            });
        }
    }
    
    // === EDIT & DELETE ===
    function startEdit(id, product) {
        if (!modalBox) return;
        
        modalBox.classList.add("active");
        editingProductId = id;
        
        // Map form fields to database fields
        const fieldMapping = {
            "productName": "product_name",
            "category": "category",
            "brand": "brand",
            "price": "price",
            "stock": "stock",
            "sku": "sku",
            "productClass": "product_class",
            "sizes": "sizes",
            "colors": "colors",
            "description": "description"
        };
        
        // Populate form fields
        Object.keys(fieldMapping).forEach(formField => {
            const dbField = fieldMapping[formField];
            const input = document.querySelector(`[name="${formField}"]`);
            if (input && product[dbField] !== undefined) {
                input.value = product[dbField] || "";
            }
        });
        
        // Update submit button
        const btn = uploadForm.querySelector('button[type="submit"]');
        if (btn) {
            btn.innerHTML = '<i data-lucide="save"></i> Update Product';
            lucide.createIcons();
        }
        
        uploadForm.scrollIntoView({ behavior: "smooth" });
    }
    
    async function deleteProduct(id) {
        if (!confirm("Are you sure you want to delete this product?")) return;
        
        try {
            const res = await fetch(`/upload/${id}`, { method: "DELETE" });
            const data = await res.json();
            
            if (data.success) {
                if (modalBox) modalBox.classList.remove("active");
                showMessage("✓ Product deleted successfully!", "success");
                setTimeout(fetchAllUploads, 1000);
            } else {
                showMessage(data.message || "Delete failed", "error");
            }
        } catch (err) {
            console.error("❌ Delete error:", err);
            showMessage("Failed to delete product", "error");
        }
    }
    
    // === FORM HANDLING ===
    if (uploadForm) {
        uploadForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            if (!editingProductId && (!fileInput.files || !fileInput.files.length)) {
                return showMessage("Please select an image to upload", "error");
            }
            
            showLoader(editingProductId ? "Updating product..." : "Uploading product...");
            
            try {
                const formData = new FormData(uploadForm);
                const url = editingProductId ? `/upload/${editingProductId}` : "/upload";
                const method = editingProductId ? "PUT" : "POST";
                
                const res = await fetch(url, { method, body: formData });
                const data = await res.json();
                
                if (res.ok && data.success) {
                    if (modalBox) modalBox.classList.remove("active");
                    showMessage(`✓ Product ${editingProductId ? "updated" : "uploaded"} successfully!`, "success");
                    uploadForm.reset();
                    editingProductId = null;
                    
                    const btn = uploadForm.querySelector('button[type="submit"]');
                    if (btn) {
                        btn.innerHTML = '<i data-lucide="plus"></i> Add Product';
                        lucide.createIcons();
                    }
                    
                    setTimeout(fetchAllUploads, 800);
                } else {
                    showMessage(data.message || "Operation failed", "error");
                }
            } catch (err) {
                console.error("❌ Upload error:", err);
                showMessage(`Operation failed: ${err.message}`, "error");
            }
        });
    }
    
    // === INIT ===
    fetchAllUploads();
});