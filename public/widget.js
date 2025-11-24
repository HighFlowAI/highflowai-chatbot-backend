(function () {
  // Get the <script> tag that loaded this widget
  const scriptEl = document.currentScript;

  // Read settings from data-attributes
  const clientId = scriptEl.getAttribute('data-client-id') || 'demo';
  const apiUrl =
    scriptEl.getAttribute('data-api-url') || 'http://localhost:3000/api/chat';
  const primaryColor =
    scriptEl.getAttribute('data-primary-color') || '#7A4FFF';
  const botName = scriptEl.getAttribute('data-bot-name') || 'HighFlow Assistant';

  // Create styles for the widget
  const style = document.createElement('style');
  style.innerHTML = `
    .hfai-chat-bubble {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: ${primaryColor};
      box-shadow: 0 8px 20px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 999999;
    }

    .hfai-chat-bubble-icon {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      color: ${primaryColor};
    }

    .hfai-chat-window {
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 340px;
      max-width: 95vw;
      height: 450px;
      max-height: 80vh;
      background: #111827;
      color: #f9fafb;
      border-radius: 16px;
      box-shadow: 0 12px 30px rgba(0,0,0,0.35);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 999999;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }

    .hfai-chat-header {
      padding: 12px 14px;
      background: linear-gradient(135deg, ${primaryColor}, #111827);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .hfai-chat-header-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .hfai-chat-avatar {
      width: 28px;
      height: 28px;
      border-radius: 999px;
      background: rgba(255,255,255,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 600;
      color: #f9fafb;
    }

    .hfai-chat-title {
      font-size: 14px;
      font-weight: 600;
    }

    .hfai-chat-subtitle {
      font-size: 11px;
      opacity: 0.8;
    }

    .hfai-chat-close {
      border: none;
      background: transparent;
      color: #f9fafb;
      font-size: 18px;
      cursor: pointer;
      padding: 0 4px;
    }

    .hfai-chat-messages {
      flex: 1;
      padding: 10px 10px 4px;
      overflow-y: auto;
      background: radial-gradient(circle at top left, #1f2933, #020617);
    }

    .hfai-message {
      max-width: 85%;
      margin-bottom: 8px;
      padding: 8px 10px;
      border-radius: 12px;
      font-size: 13px;
      line-height: 1.35;
      word-wrap: break-word;
      white-space: pre-wrap;
    }

    .hfai-message.user {
      margin-left: auto;
      background: ${primaryColor};
      color: white;
      border-bottom-right-radius: 2px;
    }

    .hfai-message.bot {
      margin-right: auto;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(148, 163, 184, 0.3);
      border-bottom-left-radius: 2px;
    }

    .hfai-chat-input-area {
      padding: 8px;
      border-top: 1px solid rgba(148, 163, 184, 0.25);
      background: #020617;
      display: flex;
      gap: 6px;
      align-items: flex-end;
    }

    .hfai-chat-input {
      flex: 1;
      resize: none;
      min-height: 32px;
      max-height: 80px;
      padding: 6px 8px;
      border-radius: 8px;
      border: 1px solid rgba(148, 163, 184, 0.4);
      background: #020617;
      color: #e5e7eb;
      font-size: 13px;
      font-family: inherit;
      outline: none;
    }

    .hfai-chat-input::placeholder {
      color: #6b7280;
    }

    .hfai-send-btn {
      border: none;
      border-radius: 999px;
      padding: 7px 12px;
      background: ${primaryColor};
      color: white;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .hfai-send-btn:disabled {
      opacity: 0.6;
      cursor: default;
    }

    .hfai-typing {
      font-size: 11px;
      opacity: 0.7;
      margin-top: 2px;
      text-align: left;
    }

    .hfai-hidden {
      display: none !important;
    }
  `;
  document.head.appendChild(style);

  // Create chat bubble
  const bubble = document.createElement('div');
  bubble.className = 'hfai-chat-bubble';
  bubble.innerHTML = `
    <div class="hfai-chat-bubble-icon">
      💬
    </div>
  `;

  // Create chat window
  const chatWindow = document.createElement('div');
  chatWindow.className = 'hfai-chat-window hfai-hidden';
  chatWindow.innerHTML = `
    <div class="hfai-chat-header">
      <div class="hfai-chat-header-left">
        <div class="hfai-chat-avatar">AI</div>
        <div>
          <div class="hfai-chat-title">${botName}</div>
          <div class="hfai-chat-subtitle">Ask me anything about this business</div>
        </div>
      </div>
      <button class="hfai-chat-close" aria-label="Close chat">×</button>
    </div>
    <div class="hfai-chat-messages"></div>
    <div class="hfai-chat-input-area">
      <textarea class="hfai-chat-input" rows="1" placeholder="Ask a question..."></textarea>
      <button class="hfai-send-btn">Send</button>
    </div>
  `;

  document.body.appendChild(bubble);
  document.body.appendChild(chatWindow);

  const closeBtn = chatWindow.querySelector('.hfai-chat-close');
  const messagesEl = chatWindow.querySelector('.hfai-chat-messages');
  const inputEl = chatWindow.querySelector('.hfai-chat-input');
  const sendBtn = chatWindow.querySelector('.hfai-send-btn');

  // Helper: add message to UI
  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `hfai-message ${sender}`;
    msg.textContent = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  // Helper: show temporary "typing" indicator
  let typingEl = null;
  function showTyping() {
    if (typingEl) return;
    typingEl = document.createElement('div');
    typingEl.className = 'hfai-typing';
    typingEl.textContent = 'AI is thinking...';
    messagesEl.appendChild(typingEl);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }
  function hideTyping() {
    if (!typingEl) return;
    typingEl.remove();
    typingEl = null;
  }

  // Welcome message
  addMessage('Hi! I’m your AI assistant. Ask me anything about this business.', 'bot');

  // Open / close logic
  bubble.addEventListener('click', () => {
    chatWindow.classList.toggle('hfai-hidden');
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.add('hfai-hidden');
  });

  // Auto resize textarea
  inputEl.addEventListener('input', () => {
    inputEl.style.height = 'auto';
    inputEl.style.height = inputEl.scrollHeight + 'px';
  });

  // Send message
  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    inputEl.value = '';
    inputEl.style.height = '32px';
    inputEl.focus();

    sendBtn.disabled = true;
    showTyping();

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId,
          message: text
        })
      });

      if (!res.ok) {
        throw new Error('Network error');
      }

      const data = await res.json();
      const reply = data.reply || 'Sorry, something went wrong.';
      hideTyping();
      addMessage(reply, 'bot');
    } catch (err) {
      hideTyping();
      addMessage('Sorry, I could not reach the AI right now.', 'bot');
      console.error('HighFlowAI widget error:', err);
    } finally {
      sendBtn.disabled = false;
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();
