import os
import requests
import numpy as np
import tflite_runtime.interpreter as tflite
import cv2
from flask import Flask, request, jsonify
import io

# Initialize Flask app
app = Flask(__name__)

# Define paths and model URLs
model_dir = 'models/'
model_1_filename = 'model_1.tflite'  # First model file
model_2_filename = 'model_2.tflite'  # Second model file
model_1_path = os.path.join(model_dir, model_1_filename)
model_2_path = os.path.join(model_dir, model_2_filename)

# GitHub URLs for the models
model_1_url = "https://github.com/sharktide/recyclesmart-api/raw/main/model_1.tflite"  # Change this to the actual URL
model_2_url = "https://github.com/sharktide/recyclesmart-api/raw/main/model_2.tflite"  # Change this to the actual URL

# Function to download models
def download_model(url, model_path):
    if not os.path.exists(model_path):
        print(f"Downloading model from {url}...")
        # Ensure the model directory exists
        os.makedirs(model_dir, exist_ok=True)

        # Download the model file from GitHub (or any other source)
        response = requests.get(url)
        if response.status_code == 200:
            # Save the model file
            with open(model_path, "wb") as f:
                f.write(response.content)
            print(f"Model downloaded successfully from {url}.")
        else:
            raise Exception(f"Failed to download model. HTTP Status: {response.status_code}")

# Function to load TensorFlow Lite model
def load_model(model_path):
    interpreter = tflite.Interpreter(model_path=model_path)
    interpreter.allocate_tensors()
    return interpreter

# Function to load both models
def load_ensemble_models():
    # Download models if not already downloaded
    download_model(model_1_url, model_1_path)
    download_model(model_2_url, model_2_path)

    # Load the models
    model_1_interpreter = load_model(model_1_path)
    model_2_interpreter = load_model(model_2_path)

    return model_1_interpreter, model_2_interpreter

# Load the ensemble models (this happens when the app starts)
model_1_interpreter, model_2_interpreter = load_ensemble_models()

# Image preprocessing function using OpenCV
def preprocess_image(image_bytes):
    # Convert byte data to numpy array
    nparr = np.frombuffer(image_bytes, np.uint8)
    
    # Read image using OpenCV
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if image is None:
        raise ValueError("Image not valid.")
    
    image_size = (240, 240)  # Adjust according to your model input size
    image = cv2.resize(image, image_size)  # Resize image using OpenCV
    
    # Normalize the image to [0, 1] range and change data type to float32
    image = image.astype(np.float32) / 255.0
    
    # Add batch dimension to the image (for model input)
    image = np.expand_dims(image, axis=0)
    
    return image

# Function to get model input and output details
def get_model_details(interpreter):
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    return input_details, output_details

# Get model details for both models
model_1_input_details, model_1_output_details = get_model_details(model_1_interpreter)
model_2_input_details, model_2_output_details = get_model_details(model_2_interpreter)

# Flask route for prediction
@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Open the image and preprocess it
        image_bytes = file.read()
        image = preprocess_image(image_bytes)

        # Set input tensors for both models
        model_1_interpreter.set_tensor(model_1_input_details[0]['index'], image)
        model_2_interpreter.set_tensor(model_2_input_details[0]['index'], image)

        # Run inference for both models
        model_1_interpreter.invoke()
        model_2_interpreter.invoke()

        # Get the output tensors from both models
        model_1_output_data = model_1_interpreter.get_tensor(model_1_output_details[0]['index'])
        model_2_output_data = model_2_interpreter.get_tensor(model_2_output_details[0]['index'])

        # Combine the predictions with weights: Model 1 weight = 0.85, Model 2 weight = 0.15
        model_1_weight = 0.85
        model_2_weight = 0.15

        # Weighted averaging
        combined_output = (model_1_weight * model_1_output_data + model_2_weight * model_2_output_data)

        # Get the class with the highest combined output value
        predicted_class = np.argmax(combined_output, axis=-1)

        # Return the predicted class as a JSON response
        return jsonify({'predicted_class': int(predicted_class[0])})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
