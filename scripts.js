document.getElementById('fileInput').addEventListener('change', handleFileSelect, true);
console.log("program started")

fetch('https://sharktide-recycleai-api.hf.space/working')

const dropArea = document.getElementById('drop-area');
const webcamSection = document.getElementById('webcam-section');
const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const takePhotoButton = document.getElementById('takePhotoButton');
const switchModeButton = document.getElementById('switchModeButton');

// Switch between file input and webcam mode
let usingWebcam = false;

switchModeButton.addEventListener('click', toggleMode);

// Drag-and-drop area event listeners
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

// File input field reference
const fileD = document.getElementById("fileInput");

// Webcam setup
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    videoElement.srcObject = stream;
    videoElement.style.display = 'none'; // Initially hide the video
    canvasElement.style.display = 'none'; // Initially hide the canvas
  })
  .catch(error => {
    console.error("Error accessing webcam: ", error);
    alert('Error accessing webcam.');
  });

// Toggle between file input and webcam mode
function toggleMode() {
  usingWebcam = !usingWebcam;

  if (usingWebcam) {
    // Switch to webcam mode
    dropArea.style.display = 'none';
    document.getElementById('fileInput').style.display = 'none';
    webcamSection.style.display = 'block';
    switchModeButton.innerText = 'Switch to File Upload'; // Change button text
    videoElement.style.display = 'block'; // Show the video element
  } else {
    // Switch to file input mode
    dropArea.style.display = 'block';
    document.getElementById('fileInput').style.display = 'block';
    webcamSection.style.display = 'none';
    switchModeButton.innerText = 'Switch to Webcam'; // Change button text
    videoElement.style.display = 'none'; // Hide the video element
  }
}

// Clear file selector
function clearFileSelector() {
  fileD.value = "";
  document.getElementById('prediction').innerText = `No result yet`;
  canvasElement.style.display = 'none';
  videoElement.style.display = 'none'; // Hide video if using webcam
}

// Handle file selection
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    document.getElementById('prediction').innerText = `Selected: ${file.name}`;
  }
}

// Capture a photo from the webcam feed
takePhotoButton.addEventListener('click', () => {
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  const context = canvasElement.getContext('2d');
  context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
  const imageData = canvasElement.toDataURL('image/png');

  // Hide video and show canvas
  videoElement.style.display = 'none';
  canvasElement.style.display = 'block';

  // Optionally, set the image data as the selected file
  const dataUrlToBlob = (dataUrl) => {
    const byteString = atob(dataUrl.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    return new Blob([uint8Array], { type: 'image/png' });
  };

  const imageBlob = dataUrlToBlob(imageData);
  const file = new File([imageBlob], 'photo.png', { type: 'image/png' });

  // Set file to the file input field (optional: simulate file input for backend)
  const fileInput = document.getElementById('fileInput');
  fileInput.files = new FileList([file]);

  // Show the result to the user
  document.getElementById('prediction').innerText = `Captured a photo!`;
});

// Predict image from selected file
function predictImage() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];
  console.log("Predicting Image:");

  if (!file) {
    alert('Please select an image first.');
    return;
  }

  // Create FormData to send to backend
  const formData = new FormData();
  formData.append('file', file);

  // Send the image to backend (Python/Flask)
  fetch('https://sharktide-recycleai-api.hf.space/predict', {
    method: 'POST',
    enctype: "multipart/form-data",
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
