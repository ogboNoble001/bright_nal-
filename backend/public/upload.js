window.addEventListener("DOMContentLoaded", () => {
    if (typeof lucide !== "undefined") lucide.createIcons();
    
    const uploadForm = document.getElementById("uploadForm");
    const toggleBtn = document.querySelector(".toggle-form-btn");
    const modalBox = document.getElementById("modalBoxForm");
    const submitBtn = uploadForm.querySelector("button[type='submit']");
    const fileInput = uploadForm.querySelector("#images");
    let editingProductId = null;
    
    const apiURL = "https://bright-nal-1.onrender.com/upload";
    
    const showMessage = (msg, type = "info") => {
        alert(`${type.toUpperCase()}: ${msg}`);
    };
    
    const openModal = () => modalBox.classList.add("active");
    const closeModal = () => modalBox.classList.remove("active");
    
    toggleBtn.addEventListener("click", () => {
        editingProductId = null;
        uploadForm.reset();
        submitBtn.textContent = "Add Product";
        openModal();
    });
    
    const populateForm = (product) => {
        uploadForm.querySelector("#productName").value = product.product_name || "";
        uploadForm.querySelector("#category").value = product.category || "";
        uploadForm.querySelector("#brand").value = product.brand || "";
        uploadForm.querySelector("#price").value = product.price || "";
        uploadForm.querySelector("#stock").value = product.stock || "";
        uploadForm.querySelector("#sku").value = product.sku || "";
        uploadForm.querySelector("#productClass").value = product.product_class || "";
        uploadForm.querySelector("#sizes").value = product.sizes || "";
        uploadForm.querySelector("#colors").value = product.colors || "";
        uploadForm.querySelector("#description").value = product.description || "";
    };
    
    const fetchAllUploads = async () => {
        try {
            const res = await fetch(`${apiURL}/files`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const products = await res.json();
            
            const container = document.querySelector(".uploadedList");
            container.innerHTML = "";
            
            products.forEach((p) => {
                const item = document.createElement("div");
                item.className = "upload-item";
                item.innerHTML = `
          <img src="${p.image_url}" alt="${p.product_name}">
          <div class="details">
            <h3>${p.product_name}</h3>
            <p>${p.category} | ${p.brand}</p>
            <p>$${p.price} | Stock: ${p.stock}</p>
          </div>
          <div class="actions">
            <button class="edit-btn" data-id="${p.id}" title="Edit"><i data-lucide="pencil"></i></button>
            <button class="delete-btn" data-id="${p.id}" title="Delete"><i data-lucide="trash-2"></i></button>
          </div>
        `;
                container.appendChild(item);
            });
            
            lucide.createIcons();
            
            document.querySelectorAll(".edit-btn").forEach((btn) => {
                btn.addEventListener("click", async () => {
                    const id = btn.dataset.id;
                    editingProductId = id;
                    const res = await fetch(`${apiURL}/${id}`);
                    const product = await res.json();
                    populateForm(product);
                    submitBtn.textContent = "Update Product";
                    openModal();
                });
            });
            
            document.querySelectorAll(".delete-btn").forEach((btn) => {
                btn.addEventListener("click", async () => {
                    const id = btn.dataset.id;
                    if (confirm("Delete this product?")) {
                        const res = await fetch(`${apiURL}/${id}`, { method: "DELETE" });
                        const data = await res.json();
                        showMessage(data.message, data.success ? "success" : "error");
                        fetchAllUploads();
                    }
                });
            });
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };
    
    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(uploadForm);
        const endpoint = editingProductId ? `${apiURL}/${editingProductId}` : apiURL;
        const method = editingProductId ? "PUT" : "POST";
        
        if (!editingProductId && (!fileInput.files || !fileInput.files.length)) {
            return showMessage("Please select an image to upload", "error");
        }
        
        try {
            const res = await fetch(endpoint, { method, body: formData });
            const data = await res.json();
            showMessage(data.message, data.success ? "success" : "error");
            if (data.success) {
                closeModal();
                uploadForm.reset();
                editingProductId = null;
                fetchAllUploads();
            }
        } catch (err) {
            console.error("Upload failed:", err);
        }
    });
    
    fetchAllUploads();
});