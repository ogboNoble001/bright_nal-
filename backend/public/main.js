const uploadForm = document.getElementById("uploadForm");
const result = document.getElementById("result");

async function fetchAllUploads() {
  try {
    const res = await fetch("/upload/files");
    const files = await res.json();

    if (files.length === 0) {
      result.innerHTML = "<p>No uploads yet.</p>";
      return;
    }

    let html = '<div class="uploads-grid">';
    files.forEach(file => {
      html += `
        <div class="upload-card">
          <img src="${file.url}" alt="${file.productName}"/>
          <div class="upload-info">
            <h3>${file.productName}</h3>
            <p><strong>Category:</strong> ${file.category}</p>
            <p><strong>Brand:</strong> ${file.brand}</p>
            <p><strong>Price:</strong> ₦${file.price}</p>
            <p><strong>Stock:</strong> ${file.stock}</p>
            <p><strong>Class:</strong> ${file.productClass}</p>
            <p><strong>SKU:</strong> ${file.sku}</p>
            <p><strong>Sizes:</strong> ${file.sizes}</p>
            <p><strong>Colors:</strong> ${file.colors}</p>
          </div>
        </div>
      `;
    });
    html += '</div>';
    result.innerHTML = html;
  } catch (err) {
    result.innerHTML = `<p class="error">Error: ${err.message}</p>`;
  }
}

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(uploadForm);

  try {
    const response = await fetch("/upload", { method: "POST", body: formData });
    const data = await response.json();

    if (data.success) {
      result.innerHTML = '<p class="success">Product uploaded successfully!</p>';
      uploadForm.reset();
      document.getElementById("imagePreview").innerHTML = '';
      fetchAllUploads();
    } else {
      result.innerHTML = `<p class="error">Error: ${data.message}</p>`;
    }
  } catch (err) {
    result.innerHTML = `<p class="error">Error: ${err.message}</p>`;
  }
});

fetchAllUploads();