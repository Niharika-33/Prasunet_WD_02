document.addEventListener("DOMContentLoaded", function() {
  let startTime;
  let updatedTime;
  let difference;
  let tInterval;
  let savedTime = 0;
  let running = false;
  let lapNumber = 0;
  let timerState = 'initial'; // 'initial', 'running', 'paused', 'reset'

  const timeDisplay = document.getElementById('time');
  const startPauseButton = document.getElementById('startPause');
  const resetButton = document.getElementById('reset');
  const lapButton = document.getElementById('lap');
  const lapsList = document.getElementById('laps');
  const zoomInButton = document.getElementById('zoomIn');
  const zoomOutButton = document.getElementById('zoomOut');
  const exportFileButton = document.getElementById('exportFile');

  function startTimer() {
    startTime = new Date().getTime() - savedTime;
    tInterval = setInterval(updateTime, 1);
    running = true;
    timerState = 'running';
    startPauseButton.textContent = 'PAUSE';
    startPauseButton.setAttribute('data-state', 'running');
  }

  function pauseTimer() {
    clearInterval(tInterval);
    savedTime = difference;
    running = false;
    timerState = 'paused';
    startPauseButton.textContent = 'RESUME';
    startPauseButton.setAttribute('data-state', 'paused');
  }

  function resetTimer() {
    clearInterval(tInterval);
    savedTime = 0;
    difference = 0;
    running = false;
    timerState = 'reset';
    startPauseButton.textContent = 'START';
    startPauseButton.setAttribute('data-state', 'initial');
    timeDisplay.textContent = '00:00:00.00';
    lapsList.innerHTML = ''; // Clear all laps
    
    // Ensure Lap History title is always present
    const lapsTitle = document.createElement('li');
    lapsTitle.textContent = 'LAP HISTORY';
    lapsTitle.id = 'laps-title'; // Assign an ID for styling purposes if needed
    lapsList.appendChild(lapsTitle);
    
    lapNumber = 0;
  }

  function recordLap() {
    if (running) {
      lapNumber++;
      const lapTime = document.createElement('li');
      lapTime.textContent = `LAP ${lapNumber}: ${timeDisplay.textContent}`;
      lapsList.appendChild(lapTime);
    }
  }

  function updateTime() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;

    let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);
    let milliseconds = Math.floor((difference % 1000) / 10);

    hours = (hours < 10) ? '0' + hours : hours;
    minutes = (minutes < 10) ? '0' + minutes : minutes;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    milliseconds = (milliseconds < 10) ? '0' + milliseconds : milliseconds;

    timeDisplay.textContent = `${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  startPauseButton.addEventListener('click', function() {
    if (timerState === 'initial' || timerState === 'reset' || timerState === 'paused') {
      startTimer();
    } else if (timerState === 'running') {
      pauseTimer();
    }
  });

  resetButton.addEventListener('click', resetTimer);
  lapButton.addEventListener('click', recordLap);
  
  let currentScale = 1;
  const scaleStep = 0.1;
  const maxScale = 1.2;
  const minScale = 0.5;
  
  zoomInButton.addEventListener('click', () => {
  if (currentScale < maxScale) {
    currentScale += scaleStep;
    document.querySelector('.stopwatch-container').style.transform = `scale(${currentScale})`;
  }
  });

  zoomOutButton.addEventListener('click', () => {
  if (currentScale > minScale) {
    currentScale -= scaleStep;
    document.querySelector('.stopwatch-container').style.transform = `scale(${currentScale})`;
  }
});
  
  
  exportFileButton.addEventListener('click', function() {
    // Export lap history as a text file
    let lapHistoryText = '';
    const laps = lapsList.querySelectorAll('li');
    laps.forEach((lap, index) => {
      lapHistoryText += lap.textContent + '\n';
    });
  // Create a Blob object with the lap history text
  const blob = new Blob([lapHistoryText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  // Create a link element and click it to trigger download
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lap_history.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
});








