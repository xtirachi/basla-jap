function navigateTo(page) {
    window.location.href = page;
}

document.addEventListener('DOMContentLoaded', function () {
    const startButtons = document.querySelectorAll('.start-btn');
    const finishButtons = document.querySelectorAll('.finish-btn');
    const uploadButtons = document.querySelectorAll('.upload-btn');
    const timers = document.querySelectorAll('.timer');
    const audio = document.querySelector("#audio");

    const playButton = document.getElementById("play-button");
    const pauseButton = document.getElementById("pause-button");
    const fileInput = document.getElementById('file-input');

    if (playButton && pauseButton) {
        playButton.addEventListener("click", () => {
            audio.play();
        });

        pauseButton.addEventListener("click", () => {
            audio.pause();
        });
    }

    startButtons.forEach((button, index) => {
        button.addEventListener('click', () => startTimer(timers[index]));
    });

    finishButtons.forEach((button, index) => {
        button.addEventListener('click', () => stopTimer(timers[index]));
    });

    uploadButtons.forEach((button) => {
        button.addEventListener('click', () => uploadFile(fileInput));
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
    fetch('https://script.google.com/macros/s/AKfycbxt8JSbBjEgBRLE596xfKPqNDv-aQgRB_X0EcUlkB-1XM0qJoxR9nJuKAO91IVi2A7e/exec', {
        method: 'POST',
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => console.log(result))
        .catch(error => console.error('Error:', error));
}

function uploadFile(fileInput) {
    if (!fileInput) {
        alert('File input element not found');
        return;
    }

    const file = fileInput.files[0];
    if (file) {
        console.log("File selected: ", file.name);
        const ixtiraCode = prompt("İxtiraçı kodunu daxil edin:");
        if (ixtiraCode) {
            const reader = new FileReader();
            reader.onloadend = function () {
                const base64 = reader.result.split(',')[1];
                const data = {
                    fileName: file.name,
                    mimeType: file.type,
                    base64: base64,
                    ixtiraCode: ixtiraCode
                };
                console.log("Uploading file: ", data);
                fetch('https://script.google.com/macros/s/AKfycbxt8JSbBjEgBRLE596xfKPqNDv-aQgRB_X0EcUlkB-1XM0qJoxR9nJuKAO91IVi2A7e/exec', {
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
    } else {
        alert('No file selected');
    }
}

let swiperOptions = {
    // Optional parameters
    // direction: 'horizontal',
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 20,
    loop: true,

    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },

    // And if we need scrollbar
    scrollbar: {
        el: '.swiper-scrollbar',
    },
}

let swiper = null;
function gridView() {
    let container = document.getElementById('viewContainer');
    if (container.classList.contains('grid-view')) {
        return;
    }
    if (swiper !== null) {
        swiper.destroy();
    }
    container.classList.remove('slider-view')
    container.classList.add('grid-view')

    document.getElementById('gridViewButton').classList.add('disable');
    document.getElementById('sliderViewButton').classList.remove('disable');
}

function sliderView() {
    let container = document.getElementById('viewContainer');
    if (container.classList.contains('slider-view')) {
        return;
    }
    swiper = new Swiper('.swiper', swiperOptions);
    container.classList.remove('grid-view')
    container.classList.add('slider-view')
    document.getElementById('gridViewButton').classList.remove('disable');
    document.getElementById('sliderViewButton').classList.add('disable');
}


(() => {
    if (window.innerWidth > 500) {
        gridView();
    } else {
        sliderView();
    }
})();

