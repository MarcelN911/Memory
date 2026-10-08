import './styles/style.scss';

const START_BUTTON = document.getElementById('startButton') as HTMLButtonElement;

START_BUTTON.addEventListener('click', function (): void {
    window.location.href = './settings.html';
});
