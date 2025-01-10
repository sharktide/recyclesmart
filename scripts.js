document.getElementById('fileInput').addEventListener('change', handleFileSelect, true);
console.log("program started");

fetch('https://sharktide-recycleai-api.hf.space/working');

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
document.getElementById('switchToWebcam').addEventListener('click', switchToWebcam);  // New button listener

const fileD = document.getElementById("fileInput");

let webcamStream = null;
let captureCanvas = document.createElement("canvas");

function clearFileSelector() {
  fileD.value = "";
  document.getElementById('prediction').innerText = `No result yet`;
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    document.getElementById('prediction').innerText = `Selected: ${file.name}`;
  }
}

function switchToWebcam() {
  // Hide the file input and show webcam controls
  document.getElementById('fileInput').style.display = 'none';
  document.getElementById('drop-area').style.display = 'none';
  document.getElementById('switchToWebcam').style.display = 'none';
  document.getElementById('switchToFile').style.display = 'inline-block';  // Show the "Switch to File" button
  document.getElementById('takePictureButton').style.display = 'inline-block'; // Show "Take Picture" button

  startWebcam();
}

function startWebcam() {
  // Start webcam
  navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      webcamStream = stream;
      const videoElement = document.createElement('video');
      videoElement.srcObject = stream;
      videoElement.play();
      
      // Attach video to the DOM
      const webcamContainer = document.getElementById('webcamContainer');
      webcamContainer.innerHTML = '';  // Clear previous content
      webcamContainer.appendChild(videoElement);

      // After the video is playing, create a snapshot when the user clicks "Take Picture"
      document.getElementById('takePictureButton').addEventListener('click', () => {
        captureSnapshot(videoElement);
      });
    })
    .catch((err) => {
      console.log("Error accessing webcam:", err);
      alert("Failed to access webcam.");
    });
}

function captureSnapshot(videoElement) {
  captureCanvas.width = videoElement.videoWidth;
  captureCanvas.height = videoElement.videoHeight;

  const ctx = captureCanvas.getContext('2d');
  ctx.drawImage(videoElement, 0, 0, captureCanvas.width, captureCanvas.height);

  // Convert the canvas to a Blob (image file)
  captureCanvas.toBlob((blob) => {
    const file = new File([blob], 'webcam_image.png', { type: 'image/png' });
    
    // Call the function to send the image
    sendImageToServer(file);
    
    // Optionally, stop the webcam stream
    webcamStream.getTracks().forEach(track => track.stop());
  }, 'image/png');
}

function sendImageToServer(file) {
  const formData = new FormData();
  formData.append('file', file);

  // Log FormData content to ensure the file is being added correctly
  console.log('Sending file:', file.name);

  fetch('https://sharktide-recycleai-api.hf.space/predict', {
    method: 'POST',
    body: formData // FormData will automatically set the correct Content-Type
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Bad request or server error');
    }
    return response.json();
  })
  .then(data => {
    // Display prediction result
    document.getElementById('prediction').innerText = `Prediction: ${data.prediction}`;
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('prediction').innerText = 'Error predicting image.';
  });
}

function predictImage() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    alert('Please select an image first.');
    return;
  }

  // Create FormData to send to backend
  const formData = new FormData();
  formData.append('file', file);

  // Log FormData content to make sure the file is being added correctly
  console.log('Sending file:', file.name);

  // Send the image to backend (Python/Flask/FastAPI)
  fetch('https://sharktide-recycleai-api.hf.space/predict', {
    method: 'POST',
    body: formData // FormData will automatically set the correct Content-Type
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Bad request or server error');
    }
    return response.json();
  })
  .then(data => {
    // Display prediction result
    document.getElementById('prediction').innerText = `Prediction: ${data.prediction}`;
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('prediction').innerText = 'Error predicting image.';
  });
}

document.getElementById('switchToFile').addEventListener('click', () => {
  // Switch back to file upload
  document.getElementById('fileInput').style.display = 'inline-block';
  document.getElementById('drop-area').style.display = 'block';
  document.getElementById('switchToWebcam').style.display = 'inline-block';
  document.getElementById('switchToFile').style.display = 'none';
  document.getElementById('takePictureButton').style.display = 'none';
  const webcamContainer = document.getElementById('webcamContainer');
  webcamContainer.innerHTML = '';  // Remove webcam stream
});
