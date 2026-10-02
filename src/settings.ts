import './styles/style.scss';

const themeImages: Record<string, string> = {
    code: '/assets/code_theme/code_card1.png',
    foot: '/assets/foot_theme/foot_card1.png',
};

const settings = document.querySelector<HTMLElement>('.settings');
const previewImage = document.querySelector<HTMLImageElement>('#previewImage');
const form = document.querySelector<HTMLFormElement>('#settingsForm');

function applyTheme(theme: string): void {
    if (!settings || !previewImage) return;
    settings.dataset.theme = theme;
    previewImage.src = themeImages[theme];
}

form?.querySelectorAll<HTMLInputElement>('input[name="theme"]').forEach((input) => {
    input.addEventListener('change', () => applyTheme(input.value));
});

form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    localStorage.setItem(
        'memorySettings',
        JSON.stringify({
            theme: data.get('theme'),
            player: data.get('player'),
            board: data.get('board'),
        }),
    );
});
