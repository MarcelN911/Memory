import './styles/style.scss';

const SETTINGS = document.querySelector('.settings') as HTMLElement;
const PREVIEW_IMAGE = document.getElementById('previewImage') as HTMLImageElement;
const FORM = document.getElementById('settingsForm') as HTMLFormElement;
const THEME_INPUTS = document.querySelectorAll('input[name="theme"]');
const ALL_INPUTS = document.querySelectorAll('input[type="radio"]');
const SUMMARY_THEME = document.getElementById('summaryTheme') as HTMLElement;
const SUMMARY_PLAYER = document.getElementById('summaryPlayer') as HTMLElement;
const SUMMARY_BOARD = document.getElementById('summaryBoard') as HTMLElement;
const START_BUTTON = document.getElementById('startButton') as HTMLButtonElement;

/**
 * Returns the preview image that matches the theme.
 * @param {string} theme - Name of the theme ('code' or 'foot')
 * @returns {string} Path to the preview image
 */
function getPreviewImage(theme: string): string {
    if (theme === 'foot') {
        return '/assets/foot_theme/bou.png';
    }
    return '/assets/code_theme/code_card1.png';
}

/**
 * Sets the theme on the page and swaps the preview image.
 * @param {string} theme - Name of the selected theme
 */
function changeTheme(theme: string): void {
    SETTINGS.dataset.theme = theme;
    PREVIEW_IMAGE.src = getPreviewImage(theme);
}

// Listens for changes on every theme radio button.
for (let i = 0; i < THEME_INPUTS.length; i++) {
    const input = THEME_INPUTS[i] as HTMLInputElement;
    input.addEventListener('change', function (): void {
        changeTheme(input.value);
    });
}

/**
 * Reads the selected value of a radio button group.
 * @param {string} name - Name of the radio button group
 * @returns {string} Value of the selected radio button, empty if nothing is selected
 */
function getCheckedValue(name: string): string {
    const checked = document.querySelector('input[name="' + name + '"]:checked') as HTMLInputElement | null;
    if (checked === null) {
        return '';
    }
    return checked.value;
}

/**
 * Checks if theme, player and board size are all selected.
 * @returns {boolean} True if everything is selected
 */
function isEverythingChosen(): boolean {
    if (getCheckedValue('theme') === '') {
        return false;
    }
    if (getCheckedValue('player') === '') {
        return false;
    }
    if (getCheckedValue('board') === '') {
        return false;
    }
    return true;
}

/**
 * Returns the text for one summary entry, or the default text if nothing is selected.
 * @param {string} value - Selected value (empty if nothing is selected)
 * @param {string} text - Text to show for a selected value
 * @param {string} fallback - Text to show if nothing is selected
 * @returns {string} The text for the summary
 */
function getSummaryText(value: string, text: string, fallback: string): string {
    if (value === '') {
        return fallback;
    }
    return text;
}

/**
 * Shows the chosen settings next to the start button.
 */
function updateSummary(): void {
    const theme = getCheckedValue('theme');
    const player = getCheckedValue('player');
    const board = getCheckedValue('board');
    const themeName = theme === 'foot' ? 'Foods theme' : 'Code vibes theme';
    const playerName = player === 'orange' ? 'Orange Player' : 'Blue Player';

    SUMMARY_THEME.textContent = getSummaryText(theme, themeName, 'Theme');
    SUMMARY_PLAYER.textContent = getSummaryText(player, playerName, 'Player');
    SUMMARY_BOARD.textContent = getSummaryText(board, 'Board-' + board + ' Cards', 'Board size');
}

/**
 * Updates the summary and enables the start button once everything is chosen.
 */
function onSelectionChange(): void {
    updateSummary();
    START_BUTTON.disabled = !isEverythingChosen();
}

// Listens for changes on every radio button.
for (let i = 0; i < ALL_INPUTS.length; i++) {
    ALL_INPUTS[i].addEventListener('change', onSelectionChange);
}

// Saves the settings and starts the game.
FORM.addEventListener('submit', function (event: Event): void {
    event.preventDefault();
    if (!isEverythingChosen()) {
        return;
    }

    const savedSettings = {
        theme: getCheckedValue('theme'),
        player: getCheckedValue('player'),
        board: getCheckedValue('board'),
    };
    localStorage.setItem('memorySettings', JSON.stringify(savedSettings));

    window.location.href = '/playground.html';
});
