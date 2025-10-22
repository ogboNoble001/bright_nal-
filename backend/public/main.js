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

// --- Show loader with progress bar ---
function showLoader() {
  result.innerHTML = `
    <div class="loader-container">
      <div class="progress-bar">
        <div class="progress-fill" style="width: 0%;"></div>
      </div>
      <p>Uploading... <span class="progress-text">0%</span></p>
    </div>
  `;
}

uploadForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(uploadForm);

  showLoader();

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/upload", true);

  xhr.upload.addEventListener("progress", (e) => {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100);
      document.querySelector(".progress-fill").style.width = percent + "%";
      document.querySelector(".progress-text").textContent = percent + "%";
    }
  });

  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      try {
        const data = JSON.parse(xhr.responseText);

        if (data.success) {
          result.innerHTML = '<p class="success">Product uploaded successfully!</p>';
          uploadForm.reset();
          document.getElementById("imagePreview").innerHTML = '';
          fetchAllUploads();
        } else {
          result.innerHTML = `<p class="error">Error: ${data.message}</p>`;
        }
      } catch (err) {
        result.innerHTML = `<p class="error">Error parsing server response</p>`;
      }
    }
  };

  xhr.send(formData);
});

fetchAllUploads();
