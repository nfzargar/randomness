# Installation Checklist ✓

Print this page or keep it open while you set up your extension!

## ☐ Step 1: Extract Files
- [ ] Download/extract the habit-tracker-extension folder
- [ ] Make sure all files are present:
  * manifest.json
  * popup.html
  * popup.js
  * background.js
  * styles.css
  * README.md
  * QUICK_SETUP.md
  * icons folder (with 3 PNG files)

## ☐ Step 2: Load Extension in Chrome
- [ ] Open Chrome
- [ ] Type `chrome://extensions/` in address bar
- [ ] Turn ON "Developer mode" (toggle switch top-right)
- [ ] Click "Load unpacked" button
- [ ] Select the habit-tracker-extension folder
- [ ] Extension appears in the list ✓
- [ ] **Write down your Extension ID**: _______________________________

## ☐ Step 3: Test Basic Functionality (Optional)
- [ ] Click extension icon in toolbar
- [ ] Extension popup opens
- [ ] You can see the current month
- [ ] You can click checkboxes
- [ ] Data persists when you close and reopen popup

**If basic functionality works, you can use the extension without Google Sheets!**

Stop here if you don't need Google Sheets integration. Otherwise, continue:

---

## ☐ Step 4: Google Cloud Console Setup

### Create Project
- [ ] Visit https://console.cloud.google.com/
- [ ] Click "Select a project" dropdown
- [ ] Click "NEW PROJECT"
- [ ] Name: "Habit Tracker" (or your choice)
- [ ] Click "CREATE"
- [ ] Wait for project creation (takes ~30 seconds)

### Enable API
- [ ] Click "APIs & Services" in left menu
- [ ] Click "Library"
- [ ] Search: "Google Sheets API"
- [ ] Click on "Google Sheets API"
- [ ] Click "ENABLE"
- [ ] Wait for confirmation

### Configure OAuth Consent Screen (if prompted)
- [ ] Click "APIs & Services" > "OAuth consent screen"
- [ ] Select "External" user type
- [ ] Click "CREATE"
- [ ] Fill in required fields:
  * App name: "Habit Tracker"
  * User support email: (your email)
  * Developer contact: (your email)
- [ ] Click "SAVE AND CONTINUE"
- [ ] Scopes: Click "SAVE AND CONTINUE" (no changes needed)
- [ ] Test users: Click "SAVE AND CONTINUE" (no changes needed)
- [ ] Summary: Click "BACK TO DASHBOARD"

### Create Credentials
- [ ] Click "APIs & Services" > "Credentials"
- [ ] Click "+ CREATE CREDENTIALS"
- [ ] Select "OAuth client ID"
- [ ] Application type: Select "Chrome extension"
- [ ] Name: "Habit Tracker Extension"
- [ ] Item ID: Paste your Extension ID from Step 2
- [ ] Click "CREATE"
- [ ] **Copy your Client ID**: _______________________________
  (It looks like: 123456789-abc...xyz.apps.googleusercontent.com)

## ☐ Step 5: Update Extension Files

### Edit manifest.json
- [ ] Open habit-tracker-extension folder
- [ ] Right-click manifest.json → Open with Text Editor
- [ ] Find the line: `"client_id": "YOUR_CLIENT_ID_HERE.apps.googleusercontent.com"`
- [ ] Replace YOUR_CLIENT_ID_HERE with your actual Client ID
- [ ] Save the file
- [ ] Close text editor

### Reload Extension
- [ ] Go back to `chrome://extensions/`
- [ ] Find "Habit Tracker" in the list
- [ ] Click the circular reload icon
- [ ] Verify no errors appear

## ☐ Step 6: Create Google Sheet

- [ ] Open https://sheets.google.com/
- [ ] Click "+ Blank" (blank spreadsheet)
- [ ] Name it: "My Habit Tracker" (top-left)
- [ ] Look at the URL, it looks like:
  `https://docs.google.com/spreadsheets/d/LONG_ID_HERE/edit`
- [ ] **Copy the ID part**: _______________________________

## ☐ Step 7: Connect Extension to Google Sheets

### Authorize
- [ ] Click your extension icon in Chrome toolbar
- [ ] Click the gear icon ⚙️ (top-right of popup)
- [ ] Click "Connect Google Sheets" button
- [ ] A Google sign-in popup appears
- [ ] Click your Google account
- [ ] Click "Advanced" (if you see a warning)
- [ ] Click "Go to Habit Tracker (unsafe)" - this is normal for new apps
- [ ] Click "Continue"
- [ ] Review permissions
- [ ] Click "Allow"
- [ ] Popup closes
- [ ] Status should show "Connected to Google"

### Link Spreadsheet
- [ ] In the settings popup, you should now see a text field
- [ ] Paste your Spreadsheet ID from Step 6
- [ ] Click "Save Configuration"
- [ ] You should see "Spreadsheet configuration saved!"
- [ ] Click X to close settings

## ☐ Step 8: Test Everything

### Test Tracking
- [ ] Click any checkbox in the habit tracker
- [ ] Click another checkbox
- [ ] Close the extension popup
- [ ] Open your Google Sheet
- [ ] You should see a new sheet tab for the current month
- [ ] You should see your habits and checkmarks ✓

### Test Persistence
- [ ] Close Chrome completely
- [ ] Reopen Chrome
- [ ] Click the extension icon
- [ ] Your checked items should still be there ✓

## 🎉 Congratulations!

You're all set up! Your habit tracker is now:
- ✓ Tracking your habits
- ✓ Saving data locally
- ✓ Syncing to Google Sheets in real-time
- ✓ Ready to help you build better habits

---

## Troubleshooting

**If something doesn't work:**

1. Check each checkbox above - did you miss a step?
2. Open browser console (F12) - are there any red error messages?
3. Verify your Client ID is correctly pasted in manifest.json
4. Make sure the Extension ID in Google Cloud matches your actual extension ID
5. Try disconnecting and reconnecting in Settings
6. Try removing and re-loading the extension

**Still stuck?**
- Review the detailed README.md file
- Check QUICK_SETUP.md for common issues
- Verify Google Sheets API is enabled in Cloud Console

---

## Quick Reference

**Extension ID**: _______________________________

**Client ID**: _______________________________

**Spreadsheet ID**: _______________________________

**Spreadsheet URL**: https://docs.google.com/spreadsheets/d/_______________________________/edit

Keep this information handy in case you need to reconfigure!
