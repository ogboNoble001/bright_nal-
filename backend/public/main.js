window.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') lucide.createIcons();

  const uploadForm = document.getElementById("uploadForm");
  const result = document.getElementById("result");
  const fileInput = document.getElementById("productImages");
  const previewGrid = document.getElementById("imagePreview");

  // --- Fetch all uploads from backend ---
  async function fetchAllUploads() {
    try {
      const res = await fetch("/upload/files"); // backend returns JSON array [{url, name}]
      if (!res.ok) throw new Error("Failed to fetch uploads");
      const files = await res.json();

      if (files.length === 0) {
        result.innerHTML = "<p>No uploads yet.</p>";
        return;
      }

      let html = "";
      files.forEach(file => {
        html += `
          <div class="upload-item">
            <img src="${file.url}" width="200" class="upload-img"/>
            <br>
            URL: <a href="${file.url}" target="_blank">${file.url}</a>
          </div>
        `;
      });
      result.innerHTML = html;
    } catch (err) {
      result.innerHTML = `<p class="error">Error fetching uploads: ${err.message}</p>`;
    }
  }

  // --- Handle new uploads ---
  if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(uploadForm);

      try {
        const response = await fetch("/upload", { method: "POST", body: formData });
        const data = await response.json();

        if (data.success) {
          // Show latest upload
          result.innerHTML = `
            <div class="upload-item">
              <img src="${data.url}" width="200" class="upload-img"/>
              <br>
              URL: <a href="${data.url}" target="_blank">${data.url}</a>
              <p class="success">Uploaded successfully!</p>
            </div>
          `;
          // Refresh all uploads below
          fetchAllUploads();
          // Clear file input
          uploadForm.reset();
          previewGrid.innerHTML = '';
        } else {
          result.innerHTML = `<p class="error">Error: ${data.message}</p>`;
        }
      } catch (err) {
        result.innerHTML = `<p class="error">Error uploading: ${err.message}</p>`;
      }
    });
  }
// --- Image preview ---
if (fileInput) {
  const previewFiles = new Set(); // track files to avoid duplicates

  fileInput.addEventListener("change", (e) => {
    previewGrid.innerHTML = '';
    previewFiles.clear();

    const files = Array.from(e.target.files);

    files.forEach((file, index) => {
      if (previewFiles.has(file.name)) return; // skip duplicates
      previewFiles.add(file.name);

      const reader = new FileReader();
      reader.onload = (event) => {
        const previewItem = document.createElement("div");
        previewItem.className = "preview-item";
        previewItem.innerHTML = `
          <img src="${event.target.result}" alt="Preview ${index + 1}" class="preview-img"/>
          <button type="button" class="preview-remove" data-name="${file.name}">
            <i data-lucide="x"></i>
          </button>
        `;
        previewGrid.appendChild(previewItem);
        if (typeof lucide !== 'undefined') lucide.createIcons();
      };
      reader.readAsDataURL(file);
    });
  });
}


  // --- Remove image from preview ---
  if (previewGrid) {
    previewGrid.addEventListener("click", (e) => {
      const removeBtn = e.target.closest(".preview-remove");
      if (removeBtn) {
        removeBtn.closest(".preview-item").remove();
      }
    });
  }
  const closeUPLOAD = document.getElementById("closeUPLOAD");
  if (closeUPLOAD) {
    closeUPLOAD.addEventListener("click", () => {
      uploadForm.reset();
      previewGrid.innerHTML = '';
    });
  }
  // Initial load of all uploaded images
  fetchAllUploads();
});
