import './styles/style.scss';

const PLAYGROUND = document.getElementById('playground') as HTMLElement;

/**
 * Loads the saved settings from the settings page.
 */
const SAVED_TEXT = localStorage.getItem('memorySettings');

if (SAVED_TEXT) {
    const saved = JSON.parse(SAVED_TEXT);

    if (saved.theme === 'foot') {
        PLAYGROUND.dataset.theme = 'foot';
    }
    if (saved.player === 'orange') {
        PLAYGROUND.dataset.player = 'orange';
    }
}

const BOARD = document.getElementById('board') as HTMLElement;
const SCORE_BLUE = document.getElementById('scoreBlue') as HTMLElement;
const SCORE_ORANGE = document.getElementById('scoreOrange') as HTMLElement;
const EXIT_BUTTON = document.getElementById('exitButton') as HTMLButtonElement;
const EXIT_DIALOG = document.getElementById('exitDialog') as HTMLDialogElement;
const BACK_BUTTON = document.getElementById('backButton') as HTMLButtonElement;
const GAME_OVER = document.getElementById('gameOver') as HTMLElement;
const WINNER_SCREEN = document.getElementById('winner') as HTMLElement;
const FINAL_BLUE = document.getElementById('finalBlue') as HTMLElement;
const FINAL_ORANGE = document.getElementById('finalOrange') as HTMLElement;
const WINNER_LABEL = document.getElementById('winnerLabel') as HTMLElement;
const WINNER_NAME = document.getElementById('winnerName') as HTMLElement;
const HOME_BUTTON = document.getElementById('homeButton') as HTMLElement;
const CONFETTI = document.getElementById('confetti') as HTMLElement;
const WINNER_IMAGE = document.getElementById('winnerImage') as HTMLImageElement;

const THEME = PLAYGROUND.dataset.theme === 'foot' ? 'foot' : 'code';

const BOARD_SIZES = [16, 24, 36];
const CARDS_PER_PAIR = 2;
const FLIP_BACK_DELAY = 1000;
const GAME_OVER_DELAY = 2500;

let firstCard: HTMLElement | null = null;
let locked = false;
const points = { blue: 0, orange: 0 };

/**
 * Returns the player who is currently on turn.
 * @returns {string} 'blue' or 'orange'
 */
function getCurrentPlayer(): string {
    return PLAYGROUND.dataset.player === 'orange' ? 'orange' : 'blue';
}

/**
 * Gives the turn to the other player.
 */
function switchPlayer(): void {
    if (getCurrentPlayer() === 'blue') {
        PLAYGROUND.dataset.player = 'orange';
    } else {
        PLAYGROUND.dataset.player = 'blue';
    }
}

/**
 * Shows the current points on the page.
 */
function showScore(): void {
    SCORE_BLUE.textContent = String(points.blue);
    SCORE_ORANGE.textContent = String(points.orange);
}

/**
 * Adds one point to the player who is on turn.
 */
function addPoint(): void {
    if (getCurrentPlayer() === 'blue') {
        points.blue++;
    } else {
        points.orange++;
    }
    showScore();
}

/**
 * Mixes the entries of a list randomly (Fisher-Yates).
 * @param {string[]} list - The list to mix
 * @returns {string[]} The mixed list
 */
function shuffle(list: string[]): string[] {
    for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = list[i];
        list[i] = list[j];
        list[j] = temp;
    }
    return list;
}

/**
 * Creates the image paths: every image twice, then mixed.
 * @param {number} count - Number of cards
 * @returns {string[]} The mixed image paths
 */
function createDeck(count: number): string[] {
    const deck: string[] = [];
    for (let i = 1; i <= count / CARDS_PER_PAIR; i++) {
        const src = `/assets/${THEME}_theme/${THEME}_card${i}.png`;
        deck.push(src);
        deck.push(src);
    }
    return shuffle(deck);
}

/**
 * Creates one face (front or back) of a card.
 * @param {string} side - 'front' or 'back'
 * @param {string} src - Image path
 * @param {string} alt - Alternative text of the image
 * @returns {HTMLElement} The face element
 */
function createFace(side: string, src: string, alt: string): HTMLElement {
    const face = document.createElement('div');
    face.className = 'card__face card__face--' + side;

    const image = document.createElement('img');
    image.src = src;
    image.alt = alt;
    face.appendChild(image);

    return face;
}

/**
 * Creates one card with back and front side.
 * @param {string} src - Image path of the front side
 * @returns {HTMLElement} The card element
 */
function createCard(src: string): HTMLElement {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.src = src;

    const inner = document.createElement('div');
    inner.className = 'card__inner';
    inner.appendChild(createFace('back', '/assets/card-top.png', 'Card back'));
    inner.appendChild(createFace('front', src, 'Card motif'));
    card.appendChild(inner);

    card.addEventListener('click', () => onCardClick(card));
    return card;
}

/**
 * Checks if a click on this card is allowed.
 * @param {HTMLElement} card - The clicked card
 * @returns {boolean} True if the card may be flipped
 */
function canFlip(card: HTMLElement): boolean {
    if (locked) {
        return false;
    }
    if (card.classList.contains('is-flipped')) {
        return false;
    }
    return true;
}

/**
 * Turns a card around or back.
 * @param {HTMLElement} card - The card
 * @param {boolean} open - True shows the picture, false shows the back
 */
function setFlipped(card: HTMLElement, open: boolean): void {
    if (open) {
        card.classList.add('is-flipped');
    } else {
        card.classList.remove('is-flipped');
    }
}

/**
 * Checks if two cards show the same picture.
 * @param {HTMLElement} a - First card
 * @param {HTMLElement} b - Second card
 * @returns {boolean} True if it is a pair
 */
function isPair(a: HTMLElement, b: HTMLElement): boolean {
    return a.dataset.src === b.dataset.src;
}

/**
 * Marks a pair as found and gives a point. The player may continue.
 * @param {HTMLElement} a - First card
 * @param {HTMLElement} b - Second card
 */
function handleMatch(a: HTMLElement, b: HTMLElement): void {
    a.classList.add('is-matched');
    b.classList.add('is-matched');
    addPoint();
    firstCard = null;
    if (isGameOver()) {
        showGameOver();
    }
}

/**
 * Turns both cards back after a short time and switches the player.
 * @param {HTMLElement} a - First card
 * @param {HTMLElement} b - Second card
 */
function handleMiss(a: HTMLElement, b: HTMLElement): void {
    locked = true;
    setTimeout(() => {
        setFlipped(a, false);
        setFlipped(b, false);
        switchPlayer();
        firstCard = null;
        locked = false;
    }, FLIP_BACK_DELAY);
}

/**
 * Handles a click on a card.
 * @param {HTMLElement} card - The clicked card
 */
function onCardClick(card: HTMLElement): void {
    if (!canFlip(card)) {
        return;
    }
    setFlipped(card, true);

    if (firstCard === null) {
        firstCard = card;
    } else if (isPair(firstCard, card)) {
        handleMatch(firstCard, card);
    } else {
        handleMiss(firstCard, card);
    }
}

/**
 * Renders the cards for the chosen board size (16, 24 or 36).
 * @param {number} count - Number of cards
 */
function renderBoard(count: number): void {
    BOARD.dataset.size = String(count);
    const deck = createDeck(count);
    for (let i = 0; i < deck.length; i++) {
        BOARD.appendChild(createCard(deck[i]));
    }
}

/**
 * Reads the board size from the settings (default 16).
 * @returns {number} 16, 24 or 36
 */
function getBoardSize(): number {
    if (SAVED_TEXT) {
        const size = Number(JSON.parse(SAVED_TEXT).board);
        if (BOARD_SIZES.includes(size)) {
            return size;
        }
    }
    return BOARD_SIZES[0];
}

showScore();
renderBoard(getBoardSize());

/**
 * Sets the text of the "back" button, it depends on the theme.
 */
function setBackButtonText(): void {
    if (THEME === 'foot') {
        BACK_BUTTON.textContent = 'No, back to game';
    } else {
        BACK_BUTTON.textContent = 'Back to game';
    }
}

/**
 * Opens the pop-up that asks if the player really wants to leave.
 */
function openExitDialog(): void {
    EXIT_DIALOG.showModal();
}

/**
 * Closes the pop-up and returns to the game.
 */
function closeExitDialog(): void {
    EXIT_DIALOG.close();
}

setBackButtonText();
EXIT_BUTTON.addEventListener('click', openExitDialog);
BACK_BUTTON.addEventListener('click', closeExitDialog);

/**
 * Checks if all cards have been found.
 * @returns {boolean} True if no card is left
 */
function isGameOver(): boolean {
    const allCards = document.querySelectorAll('.card');
    const foundCards = document.querySelectorAll('.card.is-matched');
    return allCards.length === foundCards.length;
}

/**
 * Finds out who has more points.
 * @returns {string} 'blue', 'orange' or 'draw'
 */
function getWinner(): string {
    if (points.blue > points.orange) {
        return 'blue';
    }
    if (points.orange > points.blue) {
        return 'orange';
    }
    return 'draw';
}

/**
 * Shows the "Game over" screen with the final score, then the winner.
 */
function showGameOver(): void {
    FINAL_BLUE.textContent = String(points.blue);
    FINAL_ORANGE.textContent = String(points.orange);
    GAME_OVER.hidden = false;
    setTimeout(showWinner, GAME_OVER_DELAY);
}

/**
 * Sets the texts of the winner screen.
 * @param {string} winner - 'blue', 'orange' or 'draw'
 */
function setWinnerTexts(winner: string): void {
    if (winner === 'draw') {
        WINNER_LABEL.textContent = "It's a";
        WINNER_NAME.textContent = 'Draw';
    } else if (winner === 'blue') {
        WINNER_LABEL.textContent = 'The winner is';
        WINNER_NAME.textContent = 'Blue Player';
    } else {
        WINNER_LABEL.textContent = 'The winner is';
        WINNER_NAME.textContent = 'Orange Player';
    }
    HOME_BUTTON.textContent = THEME === 'foot' ? 'Home' : 'Back to start';
}

/**
 * Returns the path of the image that belongs to the result.
 * @param {string} winner - 'blue', 'orange' or 'draw'
 * @returns {string} Path to the image
 */
function getWinnerImage(winner: string): string {
    if (winner === 'draw') {
        return `/assets/${THEME}_theme/draw.png`;
    }
    return `/assets/${THEME}_theme/${winner}_win.png`;
}

/**
 * Shows the image of the result. Confetti only appears for a winner in the code theme.
 * @param {string} winner - 'blue', 'orange' or 'draw'
 */
function showWinnerImage(winner: string): void {
    WINNER_IMAGE.src = getWinnerImage(winner);
    WINNER_IMAGE.alt = WINNER_NAME.textContent ?? '';
    CONFETTI.hidden = THEME !== 'code' || winner === 'draw';
}

/**
 * Hides the "Game over" screen and shows who has won.
 */
function showWinner(): void {
    const winner = getWinner();
    setWinnerTexts(winner);
    WINNER_SCREEN.dataset.winner = winner;
    showWinnerImage(winner);
    GAME_OVER.hidden = true;
    WINNER_SCREEN.hidden = false;
}
