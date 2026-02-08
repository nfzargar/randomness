// Background service worker for handling Google Sheets API calls

// Listen for authentication requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'authenticate') {
    authenticateWithGoogle()
      .then(token => sendResponse(token))
      .catch(error => {
        console.error('Authentication error:', error);
        sendResponse(null);
      });
    return true; // Keep channel open for async response
  }
  
  if (request.action === 'syncToSheets') {
    syncDataToGoogleSheets(request.spreadsheetId, request.data, request.accessToken)
      .then(result => sendResponse({ success: true, result }))
      .catch(error => {
        console.error('Sync error:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Keep channel open for async response
  }
});

// Authenticate with Google using Chrome Identity API
async function authenticateWithGoogle() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }
      resolve(token);
    });
  });
}

// Sync data to Google Sheets
async function syncDataToGoogleSheets(spreadsheetId, data, accessToken) {
  try {
    // First, check if the sheet exists, if not create it
    await ensureSheetExists(spreadsheetId, data.sheetName, accessToken);
    
    // Clear the existing data
    await clearSheet(spreadsheetId, data.sheetName, accessToken);
    
    // Write the new data
    const range = `${data.sheetName}!A1`;
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=RAW`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: data.values
        })
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Google Sheets API error: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to sync to Google Sheets:', error);
    throw error;
  }
}

// Ensure the sheet exists
async function ensureSheetExists(spreadsheetId, sheetName, accessToken) {
  try {
    // Get spreadsheet metadata
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        }
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to get spreadsheet metadata');
    }
    
    const spreadsheet = await response.json();
    const sheetExists = spreadsheet.sheets?.some(
      sheet => sheet.properties.title === sheetName
    );
    
    if (!sheetExists) {
      // Create the sheet
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [{
              addSheet: {
                properties: {
                  title: sheetName
                }
              }
            }]
          })
        }
      );
    }
  } catch (error) {
    console.error('Error ensuring sheet exists:', error);
    // Continue anyway - the sheet might exist
  }
}

// Clear sheet data
async function clearSheet(spreadsheetId, sheetName, accessToken) {
  try {
    const range = `${sheetName}!A1:ZZ1000`;
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:clear`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error) {
    console.error('Error clearing sheet:', error);
  }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('Habit Tracker Extension installed');
});
