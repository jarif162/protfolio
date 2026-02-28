(function () {
  const MESSAGES_KEY = "jarif_portfolio_messages";

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function getMessages() {
    try {
      const data = JSON.parse(localStorage.getItem(MESSAGES_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  function saveMessages(messages) {
    try {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
      return true;
    } catch (error) {
      return false;
    }
  }

  function addMessage(payload) {
    const messages = getMessages();
    messages.unshift({
      id: Date.now().toString(),
      name: payload.name,
      email: payload.email,
      message: payload.message,
      createdAt: new Date().toISOString(),
    });
    return saveMessages(messages);
  }

  function deleteMessage(id) {
    const messages = getMessages().filter((item) => item.id !== id);
    return saveMessages(messages);
  }

  function clearMessages() {
    return saveMessages([]);
  }

  function renderAdminInbox(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const messages = getMessages();
    if (!messages.length) {
      container.innerHTML =
        '<p class="mb-0 text-muted">No messages yet. New form submissions will appear here.</p>';
      return;
    }

    container.innerHTML = messages
      .map((item) => {
        const date = new Date(item.createdAt).toLocaleString();
        return `
          <div class="border rounded p-3 bg-white">
            <div class="d-flex justify-content-between align-items-start gap-2">
              <div>
                <p class="mb-1 fw-semibold">${escapeHtml(item.name)} (${escapeHtml(item.email)})</p>
                <p class="mb-1 small text-secondary">${escapeHtml(date)}</p>
                <p class="mb-0">${escapeHtml(item.message)}</p>
              </div>
              <button type="button" class="btn btn-sm btn-outline-danger" data-delete-message="${escapeHtml(item.id)}">Delete</button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  window.PortfolioMessages = {
    addMessage,
    clearMessages,
    deleteMessage,
    getMessages,
    renderAdminInbox,
  };
})();
