 const uploadForm = document.getElementById("uploadForm");
    const fileInput = document.getElementById("fileInput");
    const dataUrlContainer = document.getElementById("dataUrl");

    // Show data URL when a file is selected
    fileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          dataUrlContainer.textContent = event.target.result; // Display the data URL
        }
        reader.readAsDataURL(file);
      } else {
        dataUrlContainer.textContent = "";
      }
    });

    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(uploadForm);

      const response = await fetch("/upload", { method: "POST", body: formData });
      const data = await response.json();

      document.getElementById("result").innerHTML = data.success
        ? `<img src="${data.url}" width="200"/><br>Uploaded successfully!`
        : `Error: ${data.message}`;
    });