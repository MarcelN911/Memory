import './styles/style.scss';

const playground = document.getElementById('playground') as HTMLElement;

/**
 * Loads the saved settings from the settings page.
 */
const savedText = localStorage.getItem('memorySettings');

if (savedText) {
    const saved = JSON.parse(savedText);

    if (saved.theme === 'foot') {
        playground.dataset.theme = 'foot';
    }
    if (saved.player === 'orange') {
        playground.dataset.player = 'orange';
    }
}
