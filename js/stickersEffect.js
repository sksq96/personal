class StickersEffect {
    constructor(container, externalTxt) {
        this.container = container;
        this.externalTxt = externalTxt;
        this.emojis = ['💀', '🔥', '⚡', '🧠', '🎲', '💸', '🤖', '👾', '🎯', '😈', '☠️', '🎭', '🌚', '🗿', '🤡', '🫠', '💔', '🕳️', '🩻', '🧨'];
        this.everClicked = false;
        this.zCounter = 1;
    }

    init() {
        const elsToCheck = document.querySelectorAll('footer, header');

        for (const el of elsToCheck) {
            el.addEventListener('mouseenter', () => {
                if (!this.everClicked) this.externalTxt.classList.remove('in');
            });
            el.addEventListener('mouseleave', () => {
                if (!this.everClicked) this.externalTxt.classList.add('in');
            });
        }

        const handleClick = (evt) => {
            if (!this.everClicked) {
                this.everClicked = true;
                this.externalTxt.classList.add('remove');
            }
            this.spawn(evt.clientX, evt.clientY);
        };

        this.container.addEventListener('click', handleClick);
        this.externalTxt.addEventListener('click', handleClick);
    }

    spawn(x, y) {
        const emoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
        const rot = (Math.random() - 0.5) * 50;
        const scale = 0.75 + Math.random() * 0.6;

        const el = document.createElement('div');
        el.className = 'sticker-emoji';
        el.textContent = emoji;
        el.style.left = x + 'px';
        el.style.top = y + 'px';
        el.style.setProperty('--rot', rot + 'deg');
        el.style.fontSize = (64 * scale) + 'px';
        el.style.zIndex = this.zCounter++;
        this.container.appendChild(el);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => el.classList.add('active'));
        });

        setTimeout(() => {
            el.classList.add('fading');
            el.classList.remove('active');
            setTimeout(() => el.remove(), 400);
        }, 3000 + Math.random() * 1000);
    }
}
