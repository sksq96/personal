const CHAT_API = 'https://golf-commissions-cure-solve.trycloudflare.com/v1/chat/completions';
const CHAT_MODEL = '/tmp/shubham_merged_16bit';

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('chat-overlay');
    const trigger = document.getElementById('chat-trigger');
    const closeBtn = document.getElementById('chat-close');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const messagesEl = document.getElementById('chat-messages');

    if (!overlay || !trigger) return;

    const history = [
        { role: 'system', content: 'You are Shubham in a chat conversation. Respond naturally, keep it short and casual.' }
    ];

    function open() {
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        setTimeout(() => input.focus(), 400);
    }

    function close() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    trigger.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) close();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('open')) close();
    });

    function addMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = 'chat-msg chat-msg-' + type;
        msg.innerHTML = '<span class="chat-msg-text">' + escapeHtml(text) + '</span>';
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return msg;
    }

    function addTyping() {
        const el = document.createElement('div');
        el.className = 'chat-typing';
        el.innerHTML = '<span></span><span></span><span></span>';
        messagesEl.appendChild(el);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return el;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    async function send() {
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        addMessage(text, 'user');

        const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
        history.push({ role: 'user', content: '[' + now + '] You: ' + text });

        const typing = addTyping();

        try {
            const res = await fetch(CHAT_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: CHAT_MODEL,
                    messages: history,
                    temperature: 0.7,
                    max_tokens: 256,
                })
            });

            const data = await res.json();
            typing.remove();

            let reply = data.choices?.[0]?.message?.content || "hmm, i broke. try again.";
            // Strip the timestamp/name prefix if the model adds one
            reply = reply.replace(/^\[\d{4}-[^\]]+\]\s*\w+:\s*/i, '');

            history.push({ role: 'assistant', content: reply });
            addMessage(reply, 'ai');
        } catch (err) {
            typing.remove();
            addMessage("connection failed. the server is probably napping.", 'ai');
        }
    }

    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') send();
    });
});
