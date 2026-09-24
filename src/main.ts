import './styles/style.scss';

const startButton = document.querySelector<HTMLButtonElement>('#startButton');

startButton?.addEventListener('click', () => {
    window.location.href = '/settings.html';
});
