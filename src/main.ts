import './styles/style.scss';

const startButton = document.getElementById('startButton') as HTMLButtonElement;

startButton.addEventListener('click', function () {
    window.location.href = '/settings.html';
});
