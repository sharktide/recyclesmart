import os
import tensorflow as tf
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import numpy as np
import cv2

app = Flask(__name__)

# Path to the model files
ensemble1 = tf.keras.models.load_model("test_models/Resnet+.keras")
ensemble2 = tf.keras.models.load_model("test_models/78-76.keras")
ensemble3 = tf.keras.models.load_model("test_models/72-75.keras")

CLASSES = ['Glass', 'Metal', 'Paperboard', 'Plastic-Polystyrene', 'Plastic-Regular']

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg'}

# Ensure upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Check if the file has an allowed extension
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def index():
    return 'Image Classification App is running!'

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Preprocess the image for prediction
        image = cv2.imread(filepath)
        image = cv2.resize(image, (240, 240))
        image = np.array(image).reshape(-1, 240, 240, 3)

        # Make predictions using the three models
        preds_1 = ensemble1.predict(image)
        preds_2 = ensemble2.predict(image)
        preds_3 = ensemble3.predict(image)

        # Weighted average of predictions
        weight_1 = 0.50
        weight_2 = 0.25
        weight_3 = 0.25
        final_preds = (weight_1 * preds_1 + weight_2 * preds_2 + weight_3 * preds_3)

        # Get the final predicted class
        final_class = CLASSES[np.argmax(final_preds)]
        
        # Return the prediction result
        return jsonify({'prediction': final_class})

    return jsonify({'error': 'Invalid file type'})

if __name__ == '__main__':
    app.run(debug=True)
