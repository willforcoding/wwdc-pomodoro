// You got this! 💫


// 💻 Work: 25 mins
// ☕️ Short break: 5 mins
// 🌯 Long break: 15 mins
let workBtn = document.getElementById("work-btn");
let shortBreakBtn = document.getElementById("short-break-btn");
let longBreakBtn = document.getElementById("long-break-btn");
let pauseBtn = document.getElementById("pause-btn");
let resetBtn = document.getElementById("reset-btn");
let turboBtn = document.getElementById("turbo-btn");
let timeDisplay = document.getElementById("time-display")
let statusDisplay = document.getElementById("status")
let totalWorkDisplay = document.getElementById("total-work")
let totalBreakDisplay = document.getElementById("total-break")
let timeEntries = document.getElementById("time-entry");

// Audio
const music = new Audio('alarm.wav');

let timeSeconds = 0;

let isPaused = false;

let turbo = false;
let speed = 1;

timeDisplay.textContent = convertToClock(timeSeconds);

function convertToClock(seconds) {
    return new Date(seconds * 1000).toISOString().substr(14, 5);
}

function convertToTime(seconds) {
    return new Date(seconds * 1000).toISOString().substr(11, 8);
}

let timer = setInterval(updateTime, 10);
let count = 0;
let status = "IDLE";

let log = new Map();
log.set("WORK", 0);
log.set("BREAK", 0);
let total = new Map();
total.set("WORK", 0);
total.set("BREAK", 0);

function updateTime() {
    count += speed;
    if (count >= 100 && !isPaused) {
        if (timeSeconds > 0) {
            timeSeconds--;
            timeDisplay.textContent = convertToClock(timeSeconds);
            log.set(status, log.get(status) + 1)
        } else {
            if (log.get(status) > 0) {
                pushLog();
                music.play();
            }
        }
        count = 0;
    }

    if (timeSeconds > 0) {
        pauseBtn.disabled = false;
    } else {
        pauseBtn.disabled = true;
    }
}

function setTime(minute) {
    count = 0;
    timeSeconds = minute * 60;
    timeDisplay.textContent = convertToClock(timeSeconds);
}

function reset() {
    timeSeconds = 0;
    timeDisplay.textContent = convertToClock(timeSeconds);
    count = 0;
    isPaused = false;
    pauseBtn.textContent = isPaused ? "Resume" : "Pause";
    pauseBtn.classList.toggle("paused");
    if (log.get(status) > 0) {
        pushLog();
    }
}

function pushLog() {
    let elapsed = log.get(status)
    log.set(status, 0);
    total.set(status, total.get(status) + elapsed);
    displayTotal();

    let entry = `${status}: ${convertToClock(elapsed)}`
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(`${timeEntries.children.length+1}. ${entry}`));
    timeEntries.prepend(li);
    console.log(entry);
}

function displayTotal() {
    totalWorkDisplay.textContent = convertToTime(total.get("WORK"));
    totalBreakDisplay.textContent = convertToTime(total.get("BREAK"));
}

function updateStatus(minute, stats) {
    setTime(minute);
    if (log.get(status) > 0) {
        pushLog();
    }
    status = stats;
    statusDisplay.textContent = status;
}

workBtn.onclick = e => { updateStatus(25, "WORK") };
shortBreakBtn.onclick = e => { updateStatus(5, "BREAK") };
longBreakBtn.onclick = e => { updateStatus(15, "BREAK") };
pauseBtn.onclick = e => {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "Resume" : "Pause";
    pauseBtn.classList.toggle("paused");
};
turboBtn.onclick = e => {
    turbo = !turbo;
    speed = turbo ? 100 : 1;
    turboBtn.textContent = turbo ? "Normal" : "Turbo";
};
resetBtn.onclick = reset;