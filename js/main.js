document.addEventListener('DOMContentLoaded', () => {
    const toggleModeBtn = document.querySelector('.toggle-cap-container');
    toggleModeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    const cursorTxt = document.querySelector('.cursorTxt');
    const cursorHtmlEl = document.querySelector('.cursor');

    if (cursorHtmlEl && cursorHtmlEl.clientWidth) {
        const main = document.querySelector('main');

        const stickersEffect = new StickersEffect(main, cursorTxt);
        stickersEffect.init();

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
