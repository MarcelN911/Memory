import './styles/style.scss';

const settings = document.querySelector('.settings') as HTMLElement;
const previewImage = document.getElementById('previewImage') as HTMLImageElement;
const form = document.getElementById('settingsForm') as HTMLFormElement;
const themeInputs = document.querySelectorAll('input[name="theme"]');

/**
 * Returns the preview image that matches the theme.
 * @param {string} theme - Name of the theme ('code' or 'foot')
 * @returns {string} Path to the preview image
 */
function getPreviewImage(theme: string): string {
    if (theme === 'foot') {
        return '/assets/foot_theme/foot_card1.png';
    }
    return '/assets/code_theme/code_card1.png';
}

/**
 * Sets the theme on the page and swaps the preview image.
 * @param {string} theme - Name of the selected theme
 */
function changeTheme(theme: string) {
    settings.dataset.theme = theme;
    previewImage.src = getPreviewImage(theme);
}

/**
 * Listens for changes on every theme radio button.
 */
for (let i = 0; i < themeInputs.length; i++) {
    const input = themeInputs[i] as HTMLInputElement;
    input.addEventListener('change', function () {
        changeTheme(input.value);
    });
}

/**
 * Reads the selected value of a radio button group.
 * @param {string} name - Name of the radio button group
 * @returns {string} Value of the selected radio button
 */
function getCheckedValue(name: string): string {
    const checked = document.querySelector('input[name="' + name + '"]:checked') as HTMLInputElement;
    return checked.value;
}

/**
 * Saves the settings and starts the game.
 * @param {Event} event - Submit event of the form
 */
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const savedSettings = {
        theme: getCheckedValue('theme'),
        player: getCheckedValue('player'),
        board: getCheckedValue('board'),
    };
    localStorage.setItem('memorySettings', JSON.stringify(savedSettings));

    window.location.href = '/playground.html';
});
