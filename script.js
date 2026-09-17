// ==========================================
// SAVE ASSESSMENT TO ACTIVITY LOG
// ==========================================

function saveAssessment() {
    const locationInput = document.getElementById("location");
    const notesInput = document.getElementById("notes");
    const activityLog = document.getElementById("activityLog");
    const saveMessage = document.getElementById("saveMessage");

    if (!selectedImage) {
        alert("Please take or upload an image first.");
        return;
    }

    if (!currentPrediction) {
        alert("Please analyze the image before saving.");
        return;
    }

    if (!activityLog) {
        alert("Activity Log table was not found.");
        return;
    }

    const location = locationInput
        ? locationInput.value.trim()
        : "";

    const notes = notesInput
        ? notesInput.value.trim()
        : "";

    const now = new Date();

    const dateTime = now.toLocaleString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    // Remove the empty-log message when the first record is saved
    const emptyRow = activityLog.querySelector(".empty-log");

    if (emptyRow) {
        emptyRow.remove();
    }

    // Create a new table row
    const row = document.createElement("tr");

    const dateCell = document.createElement("td");
    dateCell.textContent = dateTime;

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

    // Show the newest assessment at the top
    activityLog.prepend(row);

    if (saveMessage) {
        saveMessage.textContent =
            "Assessment saved successfully!";
        saveMessage.style.color = "green";
    }

    // Clear the input fields
    if (locationInput) {
        locationInput.value = "";
    }

    if (notesInput) {
        notesInput.value = "";
    }
}
