// ==========================================
// INTELLITRAP AI-ASSISTED MONITORING SYSTEM
// Teachable Machine Image Classification
// ==========================================

// Teachable Machine model URL
const MODEL_URL =
    "https://teachablemachine.withgoogle.com/models/S5F-KssgP/";

// Global variables
let model;
let maxPredictions;
let selectedImage = null;
let selectedImageURL = null;
let currentPrediction = null;
let currentConfidence = 0;

// ==========================================
// PAGE ELEMENTS
// ==========================================

const imageInput = document.getElementById("imageInput");
const imageContainer = document.getElementById("imageContainer");
const imagePlaceholder = document.getElementById("imagePlaceholder");
const analyzeButton = document.getElementById("analyzeButton");
const imageMessage = document.getElementById("imageMessage");

const aiResultBox = document.getElementById("aiResultBox");
const predictionText = document.getElementById("prediction");
const confidenceText = document.getElementById("confidence");
const confidenceBar = document.getElementById("confidenceBar");
const assessmentNote = document.getElementById("assessmentNote");

// ==========================================
// INITIALIZE PAGE
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);

    loadModel();
    updateDemoSensors();
});

// ==========================================
// DATE AND TIME
// ==========================================

function updateDateTime() {
    const dateTimeElement = document.getElementById("dateTime");

    if (!dateTimeElement) return;

    const now = new Date();

    const formattedDate = now.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const formattedTime = now.toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    dateTimeElement.textContent = `${formattedDate} | ${formattedTime}`;
}

// ==========================================
// LOAD AI MODEL
// ==========================================

async function loadModel() {
    try {
        predictionText.textContent = "Loading AI model...";
        assessmentNote.textContent =
            "Please wait while IntelliTrap loads the AI model.";

        model = await tmImage.load(
            MODEL_URL + "model.json",
            MODEL_URL + "metadata.json"
        );

        maxPredictions = model.getTotalClasses();

        predictionText.textContent = "Ready";
        confidenceText.textContent = "--";
        confidenceBar.style.width = "0%";

        assessmentNote.textContent =
            "AI model loaded successfully. Upload an image to begin.";

        console.log("IntelliTrap AI model loaded successfully.");
    } catch (error) {
        console.error("Error loading AI model:", error);

        predictionText.textContent = "Model Error";
        confidenceText.textContent = "--";
        assessmentNote.textContent =
            "The AI model could not be loaded. Check the model URL and internet connection.";
    }
}

// ==========================================
// IMAGE UPLOAD / CAMERA INPUT
// ==========================================

if (imageInput) {
    imageInput.addEventListener("change", handleImageUpload);
}

function handleImageUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
    }

    selectedImage = file;

    if (selectedImageURL) {
        URL.revokeObjectURL(selectedImageURL);
    }

    selectedImageURL = URL.createObjectURL(file);

    // Clear the image container
    imageContainer.innerHTML = "";

    // Create image preview
    const imageElement = document.createElement("img");
    imageElement.src = selectedImageURL;
    imageElement.alt = "Uploaded site image";
    imageElement.className = "uploaded-image";
    imageElement.id = "uploadedImage";

    imageContainer.appendChild(imageElement);

    // Enable analysis
    analyzeButton.disabled = false;

    if (imageMessage) {
        imageMessage.textContent =
            "Image uploaded successfully. Click Analyze with AI.";
    }

    // Reset previous result
    currentPrediction = null;
    currentConfidence = 0;

    predictionText.textContent = "Ready to Analyze";
    confidenceText.textContent = "--";
    confidenceBar.style.width = "0%";

    assessmentNote.textContent =
        "Your image is ready for AI-assisted assessment.";
}

// ==========================================
// ANALYZE IMAGE USING TEACHABLE MACHINE
// ==========================================

async function analyzeImage() {
    if (!selectedImage) {
        alert("Please take or upload an image first.");
        return;
    }

    if (!model) {
        alert("The AI model is still loading. Please wait a moment.");
        return;
    }

    const imageElement = document.getElementById("uploadedImage");

    if (!imageElement) {
        alert("Image preview not found. Please upload the image again.");
        return;
    }

    // Disable button during analysis
    analyzeButton.disabled = true;
    analyzeButton.textContent = "Analyzing...";

    predictionText.textContent = "Analyzing...";
    confidenceText.textContent = "--";
    confidenceBar.style.width = "0%";
    assessmentNote.textContent =
        "The AI is examining the image for visual indicators of a possible mosquito breeding site.";

    try {
        // Predict image using the trained model
        const predictions = await model.predict(imageElement);

        // Find the prediction with the highest probability
        let highestPrediction = predictions[0];

        for (let i = 1; i < predictions.length; i++) {
            if (
                predictions[i].probability >
                highestPrediction.probability
            ) {
                highestPrediction = predictions[i];
            }
        }

        const className = highestPrediction.className;
        const confidenceValue = highestPrediction.probability * 100;

        currentPrediction = className;
        currentConfidence = confidenceValue;

        // Display result
        predictionText.textContent = className;
        confidenceText.textContent =
            `${confidenceValue.toFixed(1)}%`;
        confidenceBar.style.width =
            `${confidenceValue.toFixed(1)}%`;

        // Display an appropriate explanation
        if (
            className.toLowerCase().includes("possible") &&
            !className.toLowerCase().includes("not")
        ) {
            assessmentNote.textContent =
                "The AI detected visual indicators associated with a possible mosquito breeding site. Physical verification is recommended.";
        } else {
            assessmentNote.textContent =
                "The AI did not detect strong visual indicators of a possible mosquito breeding site in this image.";
        }

        console.log("AI Predictions:", predictions);
    } catch (error) {
        console.error("Error analyzing image:", error);

        predictionText.textContent = "Analysis Error";
        confidenceText.textContent = "--";
        confidenceBar.style.width = "0%";
        assessmentNote.textContent =
            "An error occurred while analyzing the image. Please try again.";
    }

    analyzeButton.disabled = false;
    analyzeButton.textContent = "✨ Analyze with AI";
}

// ==========================================
// SAVE ASSESSMENT
// ==========================================

function saveAssessment() {
    const locationInput = document.getElementById("location");
    const notesInput = document.getElementById("notes");
    const activityLog = document.getElementById("activityLog");
    const saveMessage = document.getElementById("saveMessage");

    if (!selectedImage) {
        alert("Please upload an image before saving.");
        return;
    }

    if (!currentPrediction) {
        alert("Please analyze the image before saving.");
        return;
    }

    const location = locationInput
        ? locationInput.value.trim()
        : "";

    const notes = notesInput
        ? notesInput.value.trim()
        : "";

    const now = new Date();

    const date = now.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });

    const time = now.toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.textContent = `${date}, ${time}`;

    const locationCell = document.createElement("td");
    locationCell.textContent = location || "Not specified";

    const resultCell = document.createElement("td");
    resultCell.textContent = currentPrediction;

    const confidenceCell = document.createElement("td");
    confidenceCell.textContent =
        `${currentConfidence.toFixed(1)}%`;

    const notesCell = document.createElement("td");
    notesCell.textContent = notes || "No notes";

    row.appendChild(dateCell);
    row.appendChild(locationCell);
    row.appendChild(resultCell);
    row.appendChild(confidenceCell);
    row.appendChild(notesCell);

    activityLog.prepend(row);

    if (saveMessage) {
        saveMessage.textContent =
            "Assessment saved successfully!";
        saveMessage.style.color = "green";
    }

    // Clear fields
    if (locationInput) locationInput.value = "";
    if (notesInput) notesInput.value = "";
}

// ==========================================
// DEMO SENSOR VALUES
// ==========================================

function updateDemoSensors() {
    const temperature = document.getElementById("temperature");
    const humidity = document.getElementById("humidity");
    const water = document.getElementById("water");
    const deviceStatus = document.getElementById("deviceStatus");

    if (temperature) temperature.textContent = "-- °C";
    if (humidity) humidity.textContent = "-- %";
    if (water) water.textContent = "Not Connected";

    if (deviceStatus) {
        deviceStatus.textContent = "Offline";
    }
}
