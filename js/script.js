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
const select = document.querySelector('select');

if (!(localStorage.getItem(`record-${select.value}`))) {
    localStorage.setItem(`record-${select.value}`, 0);
    recordCountEl.textContent = localStorage.getItem(`record-${select.value}`);
} else {
    recordCountEl.textContent = localStorage.getItem(`record-${select.value}`);
}


let score = 0;
let timeRemaining = 60;
let renderSleeper;
let timerId;

let level = {
    easy: {
        sleeperRenderTime: 700,
        sleeperHideTime: 1200
    },
    medium: {
        sleeperRenderTime: 500,
        sleeperHideTime: 900
    },
    hard: {
        sleeperRenderTime: 300,
        sleeperHideTime: 650
    }
};

function calcWidth() {
    const windowWidth = document.documentElement.clientWidth;

    if (windowWidth > 540) {
        level = {
            easy: {
                sleeperRenderTime: 800,
                sleeperHideTime: 1300
            },
            medium: {
                sleeperRenderTime: 600,
                sleeperHideTime: 1100
            },
            hard: {
                sleeperRenderTime: 500,
                sleeperHideTime: 900
            }
        };
    }
}

function changeLevel() {
    if (select.value === 'easy') {
        return level.easy;
    } else if (select.value === 'hard') {
        return level.hard;
    } else {
        return level.medium;
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
                item.removeEventListener('click', isCorrect);
            });

            zoneEl.forEach(item => {
                item.innerHTML = '';
            });
            gameover.style.visibility = 'visible';
            gameover.style.opacity = '1';
            gameover.style.transform = 'translate(-50%, -50%) scale(1)';

            if (score > localStorage.getItem(`record-${select.value}`)) {
                localStorage.setItem(`record-${select.value}`, score);
                recordCountEl.textContent = localStorage.getItem(`record-${select.value}`);

                recordTitleEl.textContent = 'New Record:';
                recordEl.style.border = '2px solid yellow';
                recordEl.style.color = 'yellow';
            }
        }
    }, 1000);

    renderSleeper = setInterval(() => {
        let index = Math.floor((Math.random() * zoneEl.length));
        zoneEl[index].classList.add('active');
        zoneEl[index].innerHTML = `<img src="img/sleeper.png" alt="sleeper" class="active">`;

        setTimeout(() => {
            zoneEl[index].innerHTML = '';
            zoneEl[index].classList.remove('active');
        }, changeLevel().sleeperHideTime);
        
    }, changeLevel().sleeperRenderTime);
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

    recordTitleEl.textContent = 'Your Record:';
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
        e.target.closest('.zone').classList.add('wrong');
        setTimeout(() => {
            e.target.closest('.zone').classList.remove('wrong');
        }, 100);
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

function changeRecord() {
    if (!(localStorage.getItem(`record-${select.value}`))) {
        localStorage.setItem(`record-${select.value}`, 0);
        recordCountEl.textContent = localStorage.getItem(`record-${select.value}`);
    } else {
        recordCountEl.textContent = localStorage.getItem(`record-${select.value}`);
    }
}

playBtn.addEventListener('click', startGame);
stopBtn.addEventListener('click', stopGame);
modalBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);
document.body.addEventListener('keydown', closeModal);
window.addEventListener('load', calcWidth);
select.addEventListener('change', stopGame);
select.addEventListener('change', changeLevel);
select.addEventListener('change', changeRecord);
