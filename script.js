let totalSeconds = 1500;
let selectedMinutes = 2;
let interval = null;

const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');

function updateDisplay() {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  minutesEl.textContent = String(minutes).padStart(2, '0');
  secondsEl.textContent = String(seconds).padStart(2, '0');
}

function startTimer() {
  if (interval) return;

  interval = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateDisplay();
    } else {
      clearInterval(interval);
      interval = null;
    }
  }, 1000);

  startBtn.style.display = 'none';
  pauseBtn.style.display = 'inline-block';
}

function pauseTimer() {
  clearInterval(interval);
  interval = null;

  startBtn.style.display = 'inline-block';
  pauseBtn.style.display = 'none';
}

function resetTimer() {
  pauseTimer();
  totalSeconds = selectedMinutes * 60;
  updateDisplay();
}

function setTimer(minutes) {
  selectedMinutes = minutes;
  pauseTimer();
  totalSeconds = minutes * 60;
  updateDisplay();

  startBtn.style.display = 'inline-block';
  pauseBtn.style.display = 'none';
}

document.getElementById('time1').addEventListener('click', () => setTimer(10)); 
document.getElementById('time2').addEventListener('click', () => setTimer(5)); 
document.getElementById('time3').addEventListener('click', () => setTimer(25)); 

setTimer(25); 