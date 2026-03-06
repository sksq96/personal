const CHAT_API = 'https://firms-entertaining-stanford-enrollment.trycloudflare.com/v1/chat/completions';
const CHAT_MODEL = '/tmp/shubham_merged_16bit';

document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.getElementById('chat-overlay');
    const trigger = document.getElementById('chat-trigger');
    const closeBtn = document.getElementById('chat-close');
    const input = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send');
    const messagesEl = document.getElementById('chat-messages');

    if (!overlay || !trigger) return;

    // All messages stored as { sender: 'Visitor'|'Shubham', text, timestamp }
    const chatLog = [];

    function timestamp() {
        return new Date().toISOString().replace('T', ' ').slice(0, 19);
    }

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

    // Build the single context block from all messages
    function buildContext() {
        return chatLog.map(m =>
            '[' + m.timestamp + '] ' + m.sender + ': ' + m.text
        ).join('\n');
    }

    // Parse model output: strip timestamps/name, return array of message strings
    function parseReply(raw) {
        const lines = raw.split('\n');
        const parsed = [];
        for (const line of lines) {
            const match = line.match(/\[\d{4}-[^\]]*\]\s*Shubham:\s*(.+)/i);
            if (match) {
                parsed.push(match[1].trim());
            } else if (line.trim() && !line.match(/^\[\d{4}/)) {
                // Line without timestamp format — include as-is
                parsed.push(line.trim());
            }
        }
        return parsed.length > 0 ? parsed : [raw.replace(/\[\d{4}-[^\]]*\]\s*\w+:\s*/g, '').trim() || "..."];
    }

    async function send() {
        const text = input.value.trim();
        if (!text) return;

        input.value = '';
        addMessage(text, 'user');

        chatLog.push({ sender: 'Visitor', text: text, timestamp: timestamp() });

        const typing = addTyping();

        try {
            const res = await fetch(CHAT_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: CHAT_MODEL,
                    messages: [
                        { role: 'system', content: 'You are Shubham in a chat conversation. Respond naturally.' },
                        { role: 'user', content: buildContext() }
                    ],
                    temperature: 0.7,
                    max_tokens: 256,
                })
            });

            const data = await res.json();
            typing.remove();

            const raw = data.choices?.[0]?.message?.content || '';
            const lines = parseReply(raw);

            // Add each line as a separate message bubble for that burst feel
            for (const line of lines) {
                chatLog.push({ sender: 'Shubham', text: line, timestamp: timestamp() });
                addMessage(line, 'ai');
            }
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
