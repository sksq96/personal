document.addEventListener('DOMContentLoaded', () => {
    const toggleModeBtn = document.querySelector('.toggle-cap-container');
    let isDay = false;

    document.body.classList.add('night-mode');

    function toggleMode() {
        isDay = !isDay;
        document.body.classList.remove('day-mode', 'night-mode');
        document.body.classList.add(isDay ? 'day-mode' : 'night-mode');
    }

    toggleModeBtn.addEventListener('click', toggleMode);

    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (e.key === 'd' || e.key === 'D') toggleMode();
    });

    const cursorTxt = document.querySelector('.cursorTxt');
    const cursorHtmlEl = document.querySelector('.cursor');
    const main = document.querySelector('main');

    // Stickers work on both mobile (tap) and desktop (click)
    const stickersEffect = new StickersEffect(main, cursorTxt);
    stickersEffect.init();

    // Custom cursor only on desktop (pointer device)
    if (cursorHtmlEl && cursorHtmlEl.clientWidth) {
        const cursor = new Cursor(cursorHtmlEl, cursorTxt);
        [...document.querySelectorAll('.clickable')].forEach(el => {
            el.addEventListener('mouseenter', () => cursor.enter());
            el.addEventListener('mouseleave', () => cursor.leave());
        });
    }

    // Easter eggs
    initEasterEggs();
});

function initEasterEggs() {
    // SC monogram — click to cycle secret messages
    const monogram = document.getElementById('monogram');
    const monogramMsgs = ['shubham chandel', 'secret club', 'stay curious', 'send coffee', 'seriously chill'];
    let monoIdx = 0;
    if (monogram) {
        monogram.addEventListener('click', () => {
            monoIdx++;
            monogram.textContent = monogramMsgs[monoIdx % monogramMsgs.length].toUpperCase();
            setTimeout(() => { monogram.textContent = 'SC'; }, 1500);
        });
    }

    // Tagline words — hover over specific words for hidden tooltips
    const sentence = document.getElementById('main-sentence');
    if (sentence) {
        const wordEggs = {
            'researcher': "if you can call it that",
            'accidental': 'long story',
            'quant': 'the math checks out (sometimes)',
            'deliberate': 'very deliberate',
            'founder': 'tryhue.app',
        };
        const text = sentence.textContent;
        let html = '';
        const words = text.split(/(\s+)/);
        words.forEach(word => {
            const clean = word.replace(/[.,]/g, '').toLowerCase();
            if (wordEggs[clean]) {
                const punct = word.match(/[.,]+$/) ? word.match(/[.,]+$/)[0] : '';
                const base = punct ? word.slice(0, -punct.length) : word;
                html += '<span class="easter-word">' + base + '<span class="easter-tooltip">' + wordEggs[clean] + '</span></span>' + punct;
            } else {
                html += word;
            }
        });
        sentence.innerHTML = html;
    }
}
