# URL Pinger Chrome Extension

A lightweight Chrome extension that allows users to send the current tab's URL to selected webhooks with a single click.

## Features

- Send current tab's URL to predefined webhooks
- Manage webhooks through an options page
- Simple and intuitive user interface
- Sync webhook settings across devices

## Installation

1. Clone or download this repository
2. Run `npm install` to set up the project
3. Run `npm run build` to build the extension
4. Open Chrome and navigate to `chrome://extensions`
5. Enable "Developer mode" in the top right
6. Click "Load unpacked" and select the `dist` directory

## Usage

1. Click the URL Pinger icon in your Chrome toolbar
2. Select a webhook from the dropdown
3. Click "Send URL" to send the current tab's URL to the selected webhook

### Managing Webhooks

1. Right-click the URL Pinger icon and select "Options"
2. Use the form to add new webhooks
3. Edit or delete existing webhooks using the provided buttons

## Webhook Format

The extension sends a POST request to the selected webhook URL with the following JSON payload:

```json
{
  "url": "https://current-tab-url.com",
  "timestamp": "2025-07-08T14:30:00Z"
}
```

## Development

- `npm run build`: Build the extension
- `npm run package`: Create a ZIP file for distribution

## License

MIT
