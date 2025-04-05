document.addEventListener("DOMContentLoaded", function () {
    let flashMessage = document.getElementById("flashMessage");

    if (flashMessage) {
        setTimeout(() => {
            flashMessage.classList.add("fade-out");
            setTimeout(() => flashMessage.remove(), 1000); // Remove after fade-out
        }, 3000); // 3 seconds before fade-out starts
    }
});

function updateStatus(selectElement, jobId) {
    let jobItem = document.getElementById(`job-${jobId}`);
    let jobText = jobItem.querySelector(".job-text");

    if (selectElement.value === "Selected") {
        jobText.className = "job-text selected";
        selectElement.style.backgroundColor = "lightgreen";
    } else if (selectElement.value === "Rejected") {
        jobText.className = "job-text rejected";
        selectElement.style.backgroundColor = "Red";
    } else {
        jobText.className = "job-text pending";
        selectElement.style.backgroundColor = "White";
    }

    // Send update request to the server
    fetch(`/update-status/${jobId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: selectElement.value }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Status updated:", data);
    })
    .catch(error => console.error("Error updating status:", error));
}



//for the searching purpose 
function searchJobs() {
    let input = document.getElementById("searchBox").value.toLowerCase();
    let rows = document.querySelectorAll("tr[id^='job-']");

    rows.forEach(row => {
        let jobName = row.cells[0].innerText.toLowerCase();
        let companyName = row.cells[1].innerText.toLowerCase();
        if (jobName.includes(input) || companyName.includes(input)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}

function filterJobs() {
    let selectedStatus = document.getElementById("statusFilter").value;
    let rows = document.querySelectorAll("tr[id^='job-']");

    rows.forEach(row => {
        let status = row.cells[4].querySelector("select").value;
        row.style.display = (selectedStatus === "All" || status === selectedStatus) ? "" : "none";
    });
}

function updateNotes(jobId){
    let notes = document.getElementById(`notes-${jobId}`).value;
    fetch(`/update-notes/${jobId}`, {
        method:"POST",
        headers:{
            "Content-Type": "application/json",
        },
        body: JSON.stringify({notes:notes})
    })
    .then(response => response.json())
    .then(data => {
        if(data.success){
            console.log("Notes updated successfully")
        }
        else{
            alert("Failed to update notes")
        }
    })
    .catch(error => {
        console.error("Error updating notes:", error);
    })
}


