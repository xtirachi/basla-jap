function navigateTo(page) {
    window.location.href = page;
}

document.addEventListener('DOMContentLoaded', function() {
    const startButtons = document.querySelectorAll('.start-btn');
    const finishButtons = document.querySelectorAll('.finish-btn');
    const uploadButtons = document.querySelectorAll('.upload-btn');
    const timers = document.querySelectorAll('.timer');
    const audio = document.querySelector("audio");

// Example: Add custom play/pause buttons
const playButton = document.getElementById("play-button");
const pauseButton = document.getElementById("pause-button");

playButton.addEventListener("click", () => {
    audio.play();
});

pauseButton.addEventListener("click", () => {
    audio.pause();
});
    startButtons.forEach((button, index) => {
        button.addEventListener('click', () => startTimer(timers[index]));
    });
    
    finishButtons.forEach((button, index) => {
        button.addEventListener('click', () => stopTimer(timers[index]));
    });

    uploadButtons.forEach((button, index) => {
        button.addEventListener('click', () => uploadFile(index));
    });
});

let interval;
let startTime;

function startTimer(timerElement) {
    startTime = Date.now();
    interval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        timerElement.textContent = formatTime(elapsedTime);
    }, 1000);
}

function stopTimer(timerElement) {
    clearInterval(interval);
    const elapsedTime = Date.now() - startTime;
    const formattedTime = formatTime(elapsedTime);
    const ixtiraCode = prompt("İxtiraçı kodunu daxil edin:");
    if (ixtiraCode) {
        logActivity(timerElement.closest('.activity-box'), formattedTime, ixtiraCode);
    }
}

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

function logActivity(activityBox, timeSpent, ixtiraCode) {
    const theme = document.querySelector('header h1').textContent;
    const activity = activityBox.querySelector('h2').textContent;
    const data = {
        theme: theme,
        activity: activity,
        timeSpent: timeSpent,
        ixtiraCode: ixtiraCode
    };
    fetch('https://script.google.com/macros/s/AKfycby3oe21E18BiocCPdJGR-UxTbuLRZ4N82X-48DJT6cCStL9aoftmJk_jcdG3HvbIliP/exec', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => console.log(result))
    .catch(error => console.error('Error:', error));
}

function uploadFile(index) {
    const fileInput = document.querySelectorAll('.upload')[index];
    const file = fileInput.files[0];
    if (file) {
        const ixtiraCode = prompt("İxtiraçı kodunu daxil edin:");
        if (ixtiraCode) {
            const reader = new FileReader();
            reader.onloadend = function() {
                const base64 = reader.result.split(',')[1];
                const data = {
                    fileName: file.name,
                    mimeType: file.type,
                    base64: base64,
                    ixtiraCode: ixtiraCode
                };
                fetch('https://script.google.com/macros/s/AKfycby3oe21E18BiocCPdJGR-UxTbuLRZ4N82X-48DJT6cCStL9aoftmJk_jcdG3HvbIliP/exec', {
                    method: 'POST',
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(result => {
                    alert('File uploaded successfully: ' + result.fileUrl);
                })
                .catch(error => console.error('Error:', error));
            };
            reader.readAsDataURL(file);
        }
    }
}
