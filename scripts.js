document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
console.log("program started")
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

document.getElementById('predictButton').addEventListener('click', predictImage);

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    document.getElementById('prediction').innerText = `Selected: Error`;//${file.name}`;
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
