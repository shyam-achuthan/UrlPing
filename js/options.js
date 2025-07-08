let webhooks = [];

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function saveWebhooks() {
  await chrome.storage.sync.set({ webhooks });
  renderWebhooks();
}

function renderWebhooks() {
  const webhooksList = document.getElementById('webhooksList');
  webhooksList.innerHTML = '';

  webhooks.forEach(webhook => {
    const webhookItem = document.createElement('div');
    webhookItem.className = 'webhook-item';
    webhookItem.innerHTML = `
      <div class="webhook-info">
        <div class="webhook-name">${webhook.name}</div>
        <div class="webhook-url">${webhook.url}</div>
      </div>
      <div class="webhook-actions">
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      </div>
    `;

    // Delete webhook
    webhookItem.querySelector('.delete').addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this webhook?')) {
        webhooks = webhooks.filter(w => w.id !== webhook.id);
        await saveWebhooks();
      }
    });

    // Edit webhook
    webhookItem.querySelector('.edit').addEventListener('click', () => {
      const currentInfo = webhookItem.querySelector('.webhook-info');
      const editForm = document.createElement('form');
      editForm.className = 'webhook-edit-form';
      editForm.innerHTML = `
        <div class="form-group">
          <input type="text" class="edit-name" value="${webhook.name}" required>
        </div>
        <div class="form-group">
          <input type="url" class="edit-url" value="${webhook.url}" required>
        </div>
        <button type="submit">Save</button>
        <button type="button" class="cancel">Cancel</button>
      `;

      currentInfo.style.display = 'none';
      webhookItem.insertBefore(editForm, webhookItem.querySelector('.webhook-actions'));

      editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = editForm.querySelector('.edit-name').value;
        const newUrl = editForm.querySelector('.edit-url').value;
        
        webhook.name = newName;
        webhook.url = newUrl;
        await saveWebhooks();
      });

      editForm.querySelector('.cancel').addEventListener('click', () => {
        editForm.remove();
        currentInfo.style.display = 'block';
      });
    });

    webhooksList.appendChild(webhookItem);
  });
}

// Load webhooks on page load
document.addEventListener('DOMContentLoaded', async () => {
  const data = await chrome.storage.sync.get('webhooks');
  webhooks = data.webhooks || [];
  renderWebhooks();

  // Handle new webhook form submission
  document.getElementById('webhookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('webhookName').value;
    const url = document.getElementById('webhookUrl').value;

    webhooks.push({
      id: generateUUID(),
      name,
      url
    });

    await saveWebhooks();
    e.target.reset();
  });
});
