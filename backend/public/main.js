const uploadForm = document.getElementById("uploadForm");
const result = document.getElementById("result");

async function fetchAllUploads() {
  try {
    const res = await fetch("/upload/files"); // backend should return JSON array of {url, name}
    const files = await res.json();

    if (files.length === 0) {
      result.innerHTML = "<p>No uploads yet.</p>";
      return;
    }

    let html = "";
    files.forEach(file => {
      html += `
        <div style="margin-bottom:20px; text-align:center;">
          <img src="${file.url}" width="200" style="border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.3);"/><br>
          URL: <a href="${file.url}" target="_blank">${file.url}</a>
        </div>
      `;
    });
    result.innerHTML = html;
  } catch (err) {
    result.innerHTML = `Error fetching uploads: ${err.message}`;
  }
}

// Handle new uploads
uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(uploadForm);

  try {
    const response = await fetch("/upload", { method: "POST", body: formData });
    const data = await response.json();

    if (data.success) {
      // Optionally, show a message for the latest upload
      result.innerHTML = `
        <div style="margin-bottom:20px; text-align:center;">
          <img src="${data.url}" width="200" style="border-radius:8px; box-shadow:0 4px 12px rgba(0,0,0,0.3);"/><br>
          URL: <a href="${data.url}" target="_blank">${data.url}</a><br>
          Uploaded successfully!
        </div>
      `;
      // Refresh all uploads below the new one
      fetchAllUploads();
    } else {
      result.innerHTML = `Error: ${data.message}`;
    }
  } catch (err) {
    result.innerHTML = `Error uploading: ${err.message}`;
  }
});

// Initial load of all uploads
fetchAllUploads();
