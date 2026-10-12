import './styles/style.scss';

// A fresh visit starts with empty settings.
localStorage.removeItem('memoryGameRunning');

const START_BUTTON = document.getElementById('startButton') as HTMLButtonElement;

START_BUTTON.addEventListener('click', function (): void {
    window.location.href = './settings.html';
});
