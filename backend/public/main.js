const uploadForm = document.getElementById("uploadForm");

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(uploadForm);

  const response = await fetch("/upload", { method: "POST", body: formData });
  const data = await response.json();

  document.getElementById("result").innerHTML = data.success
    ? `<img src="${data.url}" width="200"/><br>Uploaded successfully!<br>
       URL: <a href="${data.url}" target="_blank">${data.url}</a>`
    : `Error: ${data.message}`;
});
