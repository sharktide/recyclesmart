document.getElementById('fileInput').addEventListener('change', handleFileSelect, true);
console.log("program started")

fetch('https://github.com/sharktide/recyclesmart-api/raw/main/models.zip', {
  mode: 'no-cors'
})

const dropArea = document.getElementById('drop-area');
dropArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropArea.style.backgroundColor = '#e1ffe1';
}, false);

dropArea.addEventListener('dragleave', () => {
  dropArea.style.backgroundColor = '';
}, false);

dropArea.addEventListener('drop', (e) => {
  e.preventDefault();
  dropArea.style.backgroundColor = '';
  const file = e.dataTransfer.files[0];
  if (file) {
    document.getElementById('fileInput').files = e.dataTransfer.files;
  }
}, false);

document.getElementById('clearSelectorButton').addEventListener('click', clearFileSelector);
document.getElementById('predictButton').addEventListener('click', predictImage);


const fileD = document.getElementById("fileInput")

function clearFileSelector() {
  fileD.value = "";
  file.value = "";
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    document.getElementById('prediction').innerText = `Selected: ${file.name}`;
  }
}

function predictImage() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  console.log("Predicting Image:")

  if (!file) {
    alert('Please select an image first.');
    return;
  }

  // Create FormData to send to Python Flask API
  const formData = new FormData();
  formData.append('file', file);

  // Send the image file to the backend (Python/Flask) using fetch
  fetch('/predict', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    // Display prediction result
    document.getElementById('prediction').innerText = `Prediction: ${data.prediction}`;
  })
  .catch(error => {
    document.getElementById('prediction').innerText = 'Error predicting image.';
  });
}
