document.addEventListener('DOMContentLoaded', async () => {
  const currentUrlInput = document.getElementById('currentUrl');
  const webhookSelect = document.getElementById('webhookSelect');
  const sendButton = document.getElementById('sendButton');
  const feedback = document.getElementById('feedback');

  // Get current tab URL
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentUrlInput.value = tab.url;

  // Load webhooks from storage
  const { webhooks = [] } = await chrome.storage.sync.get('webhooks');
  webhooks.forEach(webhook => {
    const option = document.createElement('option');
    option.value = webhook.id;
    option.textContent = webhook.name;
    webhookSelect.appendChild(option);
  });

  // Enable/disable send button based on webhook selection
  webhookSelect.addEventListener('change', () => {
    sendButton.disabled = !webhookSelect.value;
  });
  sendButton.disabled = !webhookSelect.value;

  // Handle send button click
  sendButton.addEventListener('click', async () => {
    try {
      const selectedWebhook = webhooks.find(w => w.id === webhookSelect.value);
      if (!selectedWebhook) {
        throw new Error('Please select a webhook');
      }

      sendButton.disabled = true;
      feedback.textContent = 'Sending...';
      feedback.className = 'feedback';

      const response = await fetch(selectedWebhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: tab.url,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send URL');
      }

      feedback.textContent = '✅ Sent!';
      feedback.className = 'feedback success';
    } catch (error) {
      feedback.textContent = `❌ ${error.message}`;
      feedback.className = 'feedback error';
    } finally {
      sendButton.disabled = false;
    }
  });
});
