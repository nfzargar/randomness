# Habit Tracker Chrome Extension

A gamified habit tracker that syncs with Google Sheets in real-time. Track your daily habits with a clean, spreadsheet-style interface using grey, green, and red color palette.

## Features

- ✅ **Persistent Storage**: Data never gets lost until you explicitly archive the month
- 📊 **Google Sheets Sync**: Real-time synchronization with Google Sheets
- 📅 **Monthly Tracking**: Track habits across the entire month with weekly breakdown
- 📈 **Progress Visualization**: See your progress with stats and progress bars
- 🎨 **Clean Design**: Professional grey, green, and red color scheme
- 🔄 **Archive Function**: Save completed months to Google Sheets before starting fresh

## Installation

### Step 1: Set Up Google Cloud Project (for Google Sheets integration)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Application type: "Chrome Extension"
   - Name: "Habit Tracker Extension"
   - Get the extension ID (see Step 2 below)
   - Add the extension ID to "Authorized JavaScript origins"

5. Copy your **Client ID**

### Step 2: Load the Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `habit-tracker-extension` folder
5. **Copy the Extension ID** shown under your extension
6. Update the `manifest.json` file:
   - Replace `YOUR_CLIENT_ID_HERE` with your actual Google Cloud Client ID
   - Save the file
7. Click the reload icon on your extension card

### Step 3: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Habit Tracker Data" (or any name you prefer)
4. Copy the **Spreadsheet ID** from the URL:
   ```
   https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit
   ```

### Step 4: Connect the Extension to Google Sheets

1. Click the extension icon in Chrome toolbar
2. Click the settings gear icon (⚙️)
3. Click "Connect Google Sheets"
4. Authorize the extension in the popup window
5. Paste your Spreadsheet ID
6. Click "Save Configuration"

## Usage

### Daily Tracking

1. Click the extension icon to open the tracker
2. Click any checkbox to mark a habit as complete for that day
3. Data saves automatically and syncs to Google Sheets instantly
4. Past uncompleted days show with a red outline
5. Completed habits show with green checkmarks

### Managing Habits

1. Click "Edit Habits" button
2. Modify existing habit names or delete them
3. Click "+ Add New Habit" to add more habits
4. Click "Save Changes"
5. **Note**: Changing habits will reset your progress (you'll be prompted to confirm)

### Archiving a Month

1. At the end of the month, click "Archive Month"
2. Confirm the action
3. All data will be saved to Google Sheets
4. The extension will reset to the current month
5. Archived data remains in Google Sheets for your records

### Progress Tracking

The header shows:
- **Habits**: Total number of habits you're tracking
- **Completed**: Total checkmarks this month
- **Progress Bar**: Visual representation of completion
- **Progress %**: Overall completion percentage

Daily summaries at the bottom show:
- **Percentage**: Completion rate for that day
- **Done**: Number of completed habits
- **Not Done**: Number of incomplete habits

## Google Sheets Format

Each month creates a new sheet with the format:

```
| Habit           | 1 | 2 | 3 | 4 | 5 | ... | 31 |
|-----------------|---|---|---|---|---|-----|-----|
| Going to gym    | ✓ |   | ✓ | ✓ |   | ... |  ✓  |
| Reading 15mins  | ✓ | ✓ | ✓ |   | ✓ | ... |  ✓  |
| Eating healthy  |   | ✓ | ✓ | ✓ | ✓ | ... |  ✓  |
```

## Color Scheme

- **Grey (#757575, #bdbdbd)**: Default state, UI elements
- **Green (#4caf50, #66bb6a)**: Completed habits, progress
- **Red (#ef5350, #f44336)**: Missed/past incomplete habits

## Data Storage

- **Local Storage**: All data stored in Chrome's local storage
- **Persistent**: Data persists across browser sessions
- **Automatic Sync**: Changes sync to Google Sheets in real-time
- **Archive**: Old months stored locally and in Google Sheets

## Troubleshooting

### Extension won't load
- Make sure all files are in the same directory
- Check that manifest.json has valid JSON syntax
- Reload the extension in chrome://extensions/

### Google Sheets not syncing
- Verify you've enabled Google Sheets API in Cloud Console
- Check that Client ID is correctly set in manifest.json
- Make sure the Spreadsheet ID is correct
- Try disconnecting and reconnecting in Settings

### Data not saving
- Check browser console for errors (F12)
- Make sure Chrome has storage permissions
- Try reloading the extension

### Checkboxes not responding
- Check if JavaScript is enabled
- Try closing and reopening the extension popup
- Check browser console for errors

## Privacy

- All data stored locally in your browser
- Google Sheets data only accessible to your Google account
- No data sent to third-party servers
- Extension only requests necessary permissions

## File Structure

```
habit-tracker-extension/
├── manifest.json          # Extension configuration
├── popup.html             # Main UI structure
├── popup.js               # Frontend logic and data management
├── background.js          # Background service worker for Google Sheets API
├── styles.css             # All styling (grey, green, red theme)
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

## Customization

### Changing Colors

Edit `styles.css` to customize colors:
- Primary green: `.btn-primary`, `.progress-bar`, `.habit-cell.checked .habit-checkbox`
- Danger red: `.btn-danger`, `.habit-cell.past:not(.checked)`
- Grey shades: Various backgrounds and borders

### Default Habits

Edit the `currentData.habits` array in `popup.js` (around line 26) to change default habits.

### Popup Size

Edit `body` width and height in `styles.css` to adjust popup dimensions (default: 800x600px).

## Support

For issues or questions:
1. Check the Troubleshooting section above
2. Review browser console for errors (F12)
3. Verify Google Cloud Console settings
4. Check Google Sheets permissions

## Version History

### v1.0.0
- Initial release
- Basic habit tracking
- Google Sheets integration
- Monthly archiving
- Persistent storage

## License

This extension is provided as-is for personal use.
