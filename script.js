/* =========================================
   INTELLITRAP SCRIPT
   Temporary Manual Image Upload Version
========================================= */


/* =========================================
   DATE AND TIME
========================================= */

function updateDateTime() {
    const dateTimeElement = document.getElementById("dateTime");

    if (!dateTimeElement) return;

    const now = new Date();

    const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit"
    };

    dateTimeElement.textContent = now.toLocaleString("en-US", options);
}

updateDateTime();
setInterval(updateDateTime, 1000);


/* =========================================
   IMAGE UPLOAD AND PREVIEW
========================================= */

const imageInput = document.getElementById("imageInput");
const imageContainer = document.getElementById("imageContainer");
const imagePlaceholder = document.getElementById("imagePlaceholder");
const analyzeButton = document.getElementById("analyzeButton");
const imageMessage = document.getElementById("imageMessage");

let selectedImage = null;
let selectedImageURL = null;

if (imageInput) {
    imageInput.addEventListener("change", function () {
        const file = this.files[0];

        if (!file) return;

        // Check if the selected file is an image
        if (!file.type.startsWith("image/")) {
            imageMessage.textContent = "Please select a valid image file.";
            return;
        }

        selectedImage = file;

        // Remove the previous preview if there is one
        if (selectedImageURL) {
            URL.revokeObjectURL(selectedImageURL);
        }

        selectedImageURL = URL.createObjectURL(file);

        // Clear the preview container
        imageContainer.innerHTML = "";

        // Create image preview
        const previewImage = document.createElement("img");
        previewImage.src = selectedImageURL;
        previewImage.alt = "Selected inspection site image";
        previewImage.className = "uploaded-image";

        imageContainer.appendChild(previewImage);

        // Enable AI button
        analyzeButton.disabled = false;

        // Update message
        imageMessage.textContent =
            "Image selected: " + file.name;

        // Reset AI result
        document.getElementById("prediction").textContent =
            "Ready to analyze";

        document.getElementById("confidence").textContent = "--";
        document.getElementById("confidenceBar").style.width = "0%";

        document.getElementById("assessmentNote").textContent =
            "Your image is ready. Click “Analyze with AI” to continue.";
    });
}


/* =========================================
   AI ANALYSIS - TEMPORARY DEMO VERSION
========================================= */

function analyzeImage() {
    if (!selectedImage) {
        alert("Please choose or upload an image first.");
        return;
    }

    const predictionElement = document.getElementById("prediction");
    const confidenceElement = document.getElementById("confidence");
    const confidenceBar = document.getElementById("confidenceBar");
    const assessmentNote = document.getElementById("assessmentNote");
    const aiResultBox = document.getElementById("aiResultBox");

    // Show analyzing status
    predictionElement.textContent = "Analyzing...";
    confidenceElement.textContent = "--";
    confidenceBar.style.width = "0%";

    assessmentNote.textContent =
        "The system is processing the uploaded image...";

    aiResultBox.classList.add("analyzing");

    analyzeButton.disabled = true;

    // Temporary simulation of AI processing
    setTimeout(() => {

        /*
          TEMPORARY DEMO RESULT

          Replace this section later with your
          Teachable Machine AI model.
        */

        const prediction = "Needs Further Inspection";
        const confidence = 87;

        predictionElement.textContent = prediction;
        confidenceElement.textContent = confidence + "%";
        confidenceBar.style.width = confidence + "%";

        assessmentNote.textContent =
            "The image shows an area that requires physical verification. " +
            "This is a preliminary AI-assisted assessment.";

        aiResultBox.classList.remove("analyzing");

        analyzeButton.disabled = false;

    }, 1500);
}


/* =========================================
   SAVE ASSESSMENT
========================================= */

function saveAssessment() {
    const locationInput = document.getElementById("location");
    const notesInput = document.getElementById("notes");
    const saveMessage = document.getElementById("saveMessage");
    const activityLog = document.getElementById("activityLog");

    const prediction = document.getElementById("prediction").textContent;
    const confidence = document.getElementById("confidence").textContent;
    const temperature = document.getElementById("temperature").textContent;
    const humidity = document.getElementById("humidity").textContent;
    const water = document.getElementById("water").textContent;

    const location = locationInput.value.trim() || "Unspecified Location";
    const notes = notesInput.value.trim();

    if (!selectedImage) {
        saveMessage.textContent =
            "Please upload an image before saving.";
        return;
    }

    if (
        prediction === "Waiting for image" ||
        prediction === "Ready to analyze" ||
        prediction === "Analyzing..."
    ) {
        saveMessage.textContent =
            "Please analyze the image before saving.";
        return;
    }

    const now = new Date();

    const dateTime = now.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });

    // Remove "No records yet" row
    const emptyRow = activityLog.querySelector(".empty-row");

    if (emptyRow) {
        emptyRow.parentElement.remove();
    }

    // Create new activity row
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td>${dateTime}</td>
        <td>${location}</td>
        <td>${temperature}</td>
        <td>${humidity}</td>
        <td>${water}</td>
        <td>${prediction}</td>
        <td>${confidence}</td>
    `;

    activityLog.prepend(newRow);

    saveMessage.textContent =
        notes
            ? "Assessment saved successfully with notes."
            : "Assessment saved successfully.";

    setTimeout(() => {
        saveMessage.textContent = "";
    }, 3000);
}


/* =========================================
   TEMPORARY SENSOR VALUES
   Replace later with ESP32/Firebase data
========================================= */

// These are only sample values for testing.
// They are NOT actual ESP32 readings.

function updateDemoSensors() {
    const temperatureElement = document.getElementById("temperature");
    const humidityElement = document.getElementById("humidity");
    const waterElement = document.getElementById("water");

    if (temperatureElement) {
        temperatureElement.textContent = "-- °C";
    }

    if (humidityElement) {
        humidityElement.textContent = "-- %";
    }

    if (waterElement) {
        waterElement.textContent = "--";
    }
}

updateDemoSensors();
