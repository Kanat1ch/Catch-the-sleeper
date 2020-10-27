const playBtn = document.querySelector('.play');
const stopBtn = document.querySelector('.stop');
const scoreEl = document.querySelector('.score span');
const timeRemainingEl = document.querySelector('.time-remaining span');
const zoneEl = document.querySelectorAll('.zone');
const gameover = document.querySelector('.gameover');
const recordEl = document.querySelector('.record');
const recordCountEl = document.querySelector('.record-count');
const recordTitleEl = document.querySelector('.record-title');
const modal = document.querySelector('.modal');
const modalBtn = document.querySelector('.modal button');
const overlay = document.querySelector('.overlay');

if (!(localStorage.getItem('record'))) {
    localStorage.setItem('record', 0);
    recordCountEl.textContent = localStorage.getItem('record');
} else {
    recordCountEl.textContent = localStorage.getItem('record');
}


let score = 0;
let timeRemaining = 60;
let renderSleeper;
let timerId;

let sleeperRenderTime;
let sleeperHideTime;

function calcWidth() {
    const windowWidth = document.documentElement.clientWidth;

    if (windowWidth > 540) {
        sleeperRenderTime = 500;
        sleeperHideTime = 900;
    } else {
        sleeperRenderTime = 300;
        sleeperHideTime = 650;
    }
}

function startGame() {
    stopGame();

    zoneEl.forEach(item => {
        item.addEventListener('click', isCorrect);
    });

    timerId = setInterval(() => {
        timeRemaining--;
        timeRemainingEl.textContent = timeRemaining;

        if (timeRemaining <= 0) {
            clearInterval(timerId);
            clearInterval(renderSleeper);
            timeRemainingEl.textContent = '0';

            zoneEl.forEach(item => {
                item.innerHTML = '';
            });
            gameover.style.visibility = 'visible';
            gameover.style.opacity = '1';
            gameover.style.transform = 'translate(-50%, -50%) scale(1)';

            if (score > localStorage.getItem('record')) {
                localStorage.setItem('record', score);
                recordCountEl.textContent = localStorage.getItem('record');

                recordTitleEl.textContent = 'New Record:';
                recordEl.style.border = '2px solid yellow';
                recordEl.style.color = 'yellow';
            }
        }
    }, 1000);

    renderSleeper = setInterval(() => {
        let index = Math.floor((Math.random() * zoneEl.length));
        console.log(index);
        zoneEl[index].classList.add('active');
        zoneEl[index].innerHTML = `<img src="img/sleeper.png" alt="sleeper" class="active">`;

        setTimeout(() => {
            zoneEl[index].innerHTML = '';
            zoneEl[index].classList.remove('active');
        }, sleeperHideTime);
        
    }, sleeperRenderTime);
}

function stopGame() {
    clearInterval(timerId);
    clearInterval(renderSleeper);
    score = 0;
    scoreEl.textContent = '0';
    timeRemaining = 60;
    timeRemainingEl.textContent = '60';

    zoneEl.forEach(item => {
        item.innerHTML = '';
        item.removeEventListener('click', isCorrect);
    });

    gameover.style.visibility = 'hidden';
    gameover.style.opacity = '0';
    gameover.style.transform = 'translate(-50%, -50%) scale(0)';

    recordTitleEl.textContent = 'Your record:';
    recordEl.style.border = '';
    recordEl.style.color = '';
}

function isCorrect(e) {
    if (e.target.classList.contains('active')) {
        e.target.closest('.zone').innerHTML = '';
        e.target.classList.remove('active');
        score++;
        scoreEl.textContent = score;
    } else {
        if (score >= 0.5) {
            score -= 0.5;
            scoreEl.textContent = score;
        }
    }
}

function closeModal(e) {
    modal.style.display = 'none';
    overlay.style.display = 'none';

    if (e.key === 27) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    }
}

playBtn.addEventListener('click', startGame);
stopBtn.addEventListener('click', stopGame);
modalBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.body.addEventListener('keydown', closeModal);
window.addEventListener('load', calcWidth);
