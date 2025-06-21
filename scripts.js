// === Globals ===
let selectedFile = null;
let boundingBoxes = [];
let scaledBoxes = [];
let selectedBox = null;
let currentImg = null;
let webcamStream = null;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('fileInput');
const dropArea = document.getElementById('drop-area');
const predictionText = document.getElementById('prediction');

function warn() {
  "use strict";

  setTimeout(console.log.bind(console, "\n%cStop!", "color:red;font-size:50px;font-weight:bold;text-shadow: 1px 1px 0px black, 1px -1px 0px black, -1px 1px 0px black, -1px -1px 0px black;"));
  setTimeout(console.log.bind(console, "Using this console may allow attackers to impersonate you and steal your information using an attack called Self-XSS.Do not enter or paste code that you do not understand."));
}

const convertBoxes = (serverBoxes) => serverBoxes.map(({ box, label, confidence }) => {
  const [x1, y1, x2, y2] = box;
  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
    label,
    confidence: confidence.toFixed(2),
  };
});

function previewImage(file) {
  const img = new Image();
  img.onload = () => {
    currentImg = img;
    const scale = Math.min(500 / img.width, 500 / img.height, 1);
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    canvas.style.display = 'block';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    scaledBoxes = boundingBoxes.map(box => ({
      ...box,
      x: box.x * scale,
      y: box.y * scale,
      width: box.width * scale,
      height: box.height * scale,
    }));

    drawBoundingBoxes(scaledBoxes);
  };
  img.src = URL.createObjectURL(file);
}

function drawBoundingBoxes(boxes, highlight = null) {
  boxes.forEach(box => {
    ctx.beginPath();
    ctx.rect(box.x, box.y, box.width, box.height);
    ctx.lineWidth = 2;
    ctx.strokeStyle = box === highlight ? 'green' : 'red';
    ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
    ctx.fill();
    ctx.stroke();
  });
}

async function detectBoundingBoxes(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('https://sharktide-yolo-server.hf.space/detect', { method: 'POST', body: formData });
  const data = await response.json();
  boundingBoxes = convertBoxes(data.detections);
  previewImage(file);
}

function cropImage(file, box) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scaleX = img.width / canvas.width;
      const scaleY = img.height / canvas.height;

      const sx = box.x * scaleX, sy = box.y * scaleY;
      const sw = box.width * scaleX, sh = box.height * scaleY;

      const cropCanvas = document.createElement('canvas');
      cropCanvas.width = sw;
      cropCanvas.height = sh;

      cropCanvas.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      cropCanvas.toBlob(blob => {
        resolve(new File([blob], 'cropped.jpg', { type: 'image/jpeg' }));
      }, 'image/jpeg');
    };
    img.src = URL.createObjectURL(file);
  });
}

async function sendImageToServer(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('https://sharktide-recycleai-api.hf.space/predict', { method: 'POST', body: formData });
  const data = await response.json();
  predictionText.innerText = `Prediction: ${data.prediction}`;
}

function startWebcam() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      webcamStream = stream;
      const video = Object.assign(document.createElement('video'), {
        srcObject: stream,
        autoplay: true,
        muted: true,
        playsInline: true,
      });
      const container = document.getElementById('webcamContainer');
      container.innerHTML = '';
      container.appendChild(video);
    })
    .catch(err => console.error('Webcam error:', err));
}

function stopWebcam() {
  webcamStream?.getTracks().forEach(track => track.stop());
  webcamStream = null;
}

function showSpinner() {
  document.getElementById('spinner').style.display = 'block';
}

function hideSpinner() {
  document.getElementById('spinner').style.display = 'none';
}

document.getElementById('switchToWebcam').addEventListener('click', () => {
  dropArea.style.display = 'none';
  document.getElementById('webcamContainer').style.display = 'block';
  document.getElementById('takePictureButton').style.display = 'inline-block';
  document.getElementById('switchToWebcam').style.display = 'none';
  document.getElementById('switchToFile').style.display = 'inline-block';
  startWebcam();
});

document.getElementById('switchToFile').addEventListener('click', () => {
  stopWebcam();
  document.getElementById('webcamContainer').style.display = 'none';
  dropArea.style.display = 'block';
  document.getElementById('takePictureButton').style.display = 'none';
  document.getElementById('switchToFile').style.display = 'none';
  document.getElementById('switchToWebcam').style.display = 'inline-block';
});

document.getElementById('takePictureButton').addEventListener('click', async () => {
  const video = document.querySelector('#webcamContainer video');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.toBlob(async blob => {
    selectedFile = new File([blob], 'webcam_image.jpg', { type: 'image/jpeg' });
    await detectBoundingBoxes(selectedFile);
  }, 'image/jpeg');
});

document.getElementById('clearSelectorButton').addEventListener('click', () => {
  fileInput.value = '';
  selectedFile = null;
  boundingBoxes = scaledBoxes = [];
  selectedBox = null;
  predictionText.innerText = 'No result yet';
  canvas.style.display = 'none';
  stopWebcam();
  document.getElementById('webcamContainer').innerHTML = '';
});

canvas.addEventListener('click', (e) => {
  const { offsetX: x, offsetY: y } = e;
  selectedBox = scaledBoxes.find(box =>
    x > box.x && x < box.x + box.width &&
    y > box.y && y < box.y + box.height
  );
  if (selectedBox) {
    ctx.drawImage(currentImg, 0, 0, canvas.width, canvas.height);
    drawBoundingBoxes(scaledBoxes, selectedBox);
  }
});

document.getElementById('predictButton').addEventListener('click', async () => {
  if (!selectedBox) return alert('Please select a bounding box to predict.');
  showSpinner();
  const cropped = await cropImage(selectedFile, selectedBox);
  await sendImageToServer(cropped);
  hideSpinner();
});


dropArea.addEventListener('click', () => fileInput.click());

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt =>
  dropArea.addEventListener(evt, e => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.toggle('highlight', ['dragenter', 'dragover'].includes(evt));
  })
);

dropArea.addEventListener('drop', e => {
  const files = e.dataTransfer.files;
  if (files.length) {
    fileInput.files = files;
    fileInput.dispatchEvent(new Event('change'));
  }
});

fileInput.addEventListener('change', async (e) => {
  selectedFile = e.target.files[0];
  if (selectedFile) {
    document.getElementById('fileStatus').innerText = `Selected: ${selectedFile.name}`;
    showSpinner();
    await detectBoundingBoxes(selectedFile);
    hideSpinner();
  }
});

window.onload = warn;