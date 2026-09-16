// =====================================================
// INTELLITRAP CONFIGURATION
// =====================================================

// Replace YOUR_MODEL_ID with your actual Teachable Machine model ID.
const MODEL_URL =
    const MODEL_URL =
    "https://teachablemachine.withgoogle.com/models/YOUR_MODEL_ID/";

let model;
let latestPrediction = "Not Analyzed";
let latestConfidence = 0;


// =====================================================
// DATE AND TIME
// =====================================================

function updateDateTime() {
    const now = new Date();

    document.getElementById("dateTime").textContent =
        now.toLocaleString("en-PH", {
            dateStyle: "medium",
            timeStyle: "short"
        });
}

updateDateTime();
setInterval(updateDateTime, 1000);


// =====================================================
// LOAD AI MODEL
// =====================================================

async function loadAIModel() {
    try {
        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);

        console.log("AI model loaded successfully.");

    } catch (error) {
        console.error("AI model loading error:", error);

        document.getElementById("prediction").textContent =
            "Model Unavailable";

        document.getElementById("assessmentNote").textContent =
            "Please replace the model URL with your trained AI model link.";
    }
}

loadAIModel();


// =====================================================
// TEMPORARY ESP32 SENSOR SIMULATION
// Replace this section later with actual ESP32 data.
// =====================================================

function updateSensorReadings() {
    const temperature = (27 + Math.random() * 5).toFixed(1);
    const humidity = Math.floor(65 + Math.random() * 25);
    const waterDetected = Math.random() > 0.5;

    document.getElementById("temperature").textContent =
        temperature + " °C";

    document.getElementById("humidity").textContent =
        humidity + " %";

    document.getElementById("water").textContent =
        waterDetected ? "Detected" : "Not Detected";

    document.getElementById("deviceStatus").textContent =
        "Connected";
}

updateSensorReadings();
setInterval(updateSensorReadings, 3000);


// =====================================================
// IMAGE CAPTURE AND PREVIEW
// =====================================================

const imageInput = document.getElementById("imageInput");
const previewImage = document.getElementById("previewImage");
const imagePlaceholder = document.getElementById("imagePlaceholder");
const analyzeButton = document.getElementById("analyzeButton");
const imageMessage = document.getElementById("imageMessage");

imageInput.addEventListener("change", function () {
    const file = this.files[0];

    if (!file) {
        return;
    }

    const imageURL = URL.createObjectURL(file);

    previewImage.src = imageURL;
    previewImage.style.display = "block";
    imagePlaceholder.style.display = "none";

    analyzeButton.disabled = false;

    imageMessage.textContent =
        "Image captured. Click Analyze with AI.";
});


// =====================================================
// AI IMAGE ANALYSIS
// =====================================================

async function analyzeImage() {
    if (!model) {
        alert("The AI model is not loaded. Check your model URL.");
        return;
    }

    if (!previewImage.src) {
        alert("Please capture an image first.");
        return;
    }

    analyzeButton.disabled = true;
    analyzeButton.textContent = "Analyzing...";

    document.getElementById("prediction").textContent =
        "Analyzing image...";

    document.getElementById("confidence").textContent =
        "--";

    document.getElementById("confidenceBar").style.width =
        "0%";

    try {
        const predictions = await model.predict(previewImage);

        let highestPrediction = predictions[0];

        for (let i = 1; i < predictions.length; i++) {
            if (
                predictions[i].probability >
                highestPrediction.probability
            ) {
                highestPrediction = predictions[i];
            }
        }

        latestPrediction = highestPrediction.className;
        latestConfidence = highestPrediction.probability;

        const confidencePercentage =
            (latestConfidence * 100).toFixed(2);

        document.getElementById("prediction").textContent =
            latestPrediction;

        document.getElementById("confidence").textContent =
            confidencePercentage + "%";

        document.getElementById("confidenceBar").style.width =
            confidencePercentage + "%";

        updateAssessmentStyle(latestPrediction);

    } catch (error) {
        console.error("Analysis error:", error);

        document.getElementById("prediction").textContent =
            "Analysis Failed";

        document.getElementById("assessmentNote").textContent =
            "Please try another image.";
    }

    analyzeButton.disabled = false;
    analyzeButton.textContent = "✨ Analyze with AI";
}


// =====================================================
// CHANGE AI RESULT DESIGN BASED ON PREDICTION
// =====================================================

function updateAssessmentStyle(prediction) {
    const resultBox = document.getElementById("aiResultBox");
    const predictionText = document.getElementById("prediction");
    const resultIcon = document.querySelector(".result-status-icon");
    const note = document.getElementById("assessmentNote");

    const lowerPrediction = prediction.toLowerCase();

    if (lowerPrediction.includes("potential")) {
        resultBox.style.background = "#fff4f3";
        resultBox.style.borderColor = "#ffd7d3";
        predictionText.style.color = "#d34845";
        resultIcon.style.background = "#ff7770";
        resultIcon.textContent = "!";

        note.textContent =
            "The AI detected visible indicators associated with a possible mosquito breeding site. Further physical inspection is recommended.";

    } else if (
        lowerPrediction.includes("unlikely") ||
        lowerPrediction.includes("not")
    ) {
        resultBox.style.background = "#eafaf2";
        resultBox.style.borderColor = "#c5ead8";
        predictionText.style.color = "#16805f";
        resultIcon.style.background = "#22a875";
        resultIcon.textContent = "✓";

        note.textContent =
            "The AI did not detect strong visible breeding-site indicators in the image.";

    } else {
        resultBox.style.background = "#fff9e8";
        resultBox.style.borderColor = "#f4df9e";
        predictionText.style.color = "#a47a16";
        resultIcon.style.background = "#e1ae32";
        resultIcon.textContent = "?";

        note.textContent =
            "The image requires further inspection because the visible conditions are unclear.";
    }
}


// =====================================================
// SAVE ASSESSMENT TO ACTIVITY LOG
// =====================================================

function saveAssessment() {
    const location = document.getElementById("location").value;
    const notes = document.getElementById("notes").value;

    if (location.trim() === "") {
        alert("Please enter the site location.");
        return;
    }

    if (latestPrediction === "Not Analyzed") {
        alert("Please analyze an image before saving.");
        return;
    }

    const temperature =
        document.getElementById("temperature").textContent;

    const humidity =
        document.getElementById("humidity").textContent;

    const water =
        document.getElementById("water").textContent;

    const confidence =
        (latestConfidence * 100).toFixed(2) + "%";

    const dateTime = new Date().toLocaleString("en-PH");

    const table = document.getElementById("activityLog");

    const emptyRow = table.querySelector(".empty-row");

    if (emptyRow) {
        table.innerHTML = "";
    }

    const newRow = table.insertRow();

    newRow.insertCell(0).textContent = dateTime;
    newRow.insertCell(1).textContent = location;
    newRow.insertCell(2).textContent = temperature;
    newRow.insertCell(3).textContent = humidity;
    newRow.insertCell(4).textContent = water;
    newRow.insertCell(5).textContent = latestPrediction;
    newRow.insertCell(6).textContent = confidence;

    document.getElementById("saveMessage").textContent =
        "Assessment saved successfully.";

    document.getElementById("location").value = "";
    document.getElementById("notes").value = "";
}