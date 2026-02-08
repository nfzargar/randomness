// Initialize on load
document.addEventListener('DOMContentLoaded', async () => {
  await initializeTracker();
  setupEventListeners();
});

// Global state
let currentData = {
  month: null,
  year: null,
  habits: [],
  checkedCells: {},
  spreadsheetId: null,
  isAuthenticated: false
};

// Initialize the tracker
async function initializeTracker() {
  // Load data from Chrome storage
  const stored = await chrome.storage.local.get(['habitData', 'spreadsheetId', 'accessToken']);
  
  if (stored.habitData) {
    currentData = { ...currentData, ...stored.habitData };
  } else {
    // Initialize with current month
    const now = new Date();
    currentData.month = now.getMonth();
    currentData.year = now.getFullYear();
    currentData.habits = [
      'Going to the gym',
      'Reading 15mins',
      'Eating healthy',
      'Don\'t smoke',
      'Meeting with friends',
      'No videogames',
      'Be positiv',
      'Studying',
      'Meeting mom',
      'Cooking healthy'
    ];
    currentData.checkedCells = {};
  }

  if (stored.spreadsheetId) {
    currentData.spreadsheetId = stored.spreadsheetId;
  }

  if (stored.accessToken) {
    currentData.isAuthenticated = true;
  }

  renderTracker();
  updateStats();
}

// Save data to Chrome storage
async function saveData() {
  await chrome.storage.local.set({
    habitData: {
      month: currentData.month,
      year: currentData.year,
      habits: currentData.habits,
      checkedCells: currentData.checkedCells
    }
  });

  // Sync to Google Sheets if connected
  if (currentData.isAuthenticated && currentData.spreadsheetId) {
    await syncToGoogleSheets();
  }
}

// Render the entire tracker
function renderTracker() {
  renderMonthHeader();
  renderHabitsColumn();
  renderDaysGrid();
  renderSummaryRow();
}

// Render month header
function renderMonthHeader() {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  document.getElementById('currentMonth').textContent = 
    `${monthNames[currentData.month]} ${currentData.year}`;
}

// Render habits column
function renderHabitsColumn() {
  const container = document.getElementById('habitsLabels');
  container.innerHTML = '';
  
  currentData.habits.forEach((habit) => {
    const label = document.createElement('div');
    label.className = 'habit-label';
    label.textContent = habit;
    container.appendChild(label);
  });
}

// Render days grid
function renderDaysGrid() {
  const container = document.getElementById('daysGrid');
  container.innerHTML = '';
  
  const daysInMonth = new Date(currentData.year, currentData.month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentData.month && 
                         today.getFullYear() === currentData.year;
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentData.year, currentData.month, day);
    const dayColumn = document.createElement('div');
    dayColumn.className = 'day-column';
    
    // Day header
    const header = document.createElement('div');
    header.className = 'day-header';
    
    const dayName = document.createElement('div');
    dayName.className = 'day-name';
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    dayName.textContent = dayNames[date.getDay()];
    
    const dayNumber = document.createElement('div');
    dayNumber.className = 'day-number';
    if (date.getDay() === 0 || date.getDay() === 6) {
      dayNumber.classList.add('weekend');
    }
    dayNumber.textContent = day;
    
    header.appendChild(dayName);
    header.appendChild(dayNumber);
    dayColumn.appendChild(header);
    
    // Day cells (habits)
    const dayCells = document.createElement('div');
    dayCells.className = 'day-cells';
    
    currentData.habits.forEach((habit, habitIndex) => {
      const cell = document.createElement('div');
      cell.className = 'habit-cell';
      
      const cellKey = `${habitIndex}-${day}`;
      const isChecked = currentData.checkedCells[cellKey] || false;
      
      // Mark as past if before today
      if (isCurrentMonth && day < today.getDate()) {
        cell.classList.add('past');
      }
      
      if (isChecked) {
        cell.classList.add('checked');
      }
      
      const checkbox = document.createElement('div');
      checkbox.className = 'habit-checkbox';
      checkbox.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
      
      cell.appendChild(checkbox);
      
      // Add click handler
      cell.addEventListener('click', () => toggleCell(habitIndex, day));
      
      dayCells.appendChild(cell);
    });
    
    dayColumn.appendChild(dayCells);
    container.appendChild(dayColumn);
  }
}

// Render summary row
function renderSummaryRow() {
  const container = document.getElementById('summaryRow');
  container.innerHTML = '';
  
  const spacer = document.createElement('div');
  spacer.className = 'summary-spacer';
  container.appendChild(spacer);
  
  const summaryGrid = document.createElement('div');
  summaryGrid.className = 'summary-grid';
  
  const daysInMonth = new Date(currentData.year, currentData.month + 1, 0).getDate();
  
  for (let day = 1; day <= daysInMonth; day++) {
    const summary = document.createElement('div');
    summary.className = 'day-summary';
    
    const stats = getDayStats(day);
    
    const percent = document.createElement('div');
    percent.className = 'summary-percent';
    percent.textContent = `${stats.percent}%`;
    
    const done = document.createElement('div');
    done.className = 'summary-done';
    done.textContent = stats.done;
    
    const notDone = document.createElement('div');
    notDone.className = 'summary-notdone';
    notDone.textContent = stats.notDone;
    
    summary.appendChild(percent);
    summary.appendChild(done);
    summary.appendChild(notDone);
    
    summaryGrid.appendChild(summary);
  }
  
  container.appendChild(summaryGrid);
}

// Get stats for a specific day
function getDayStats(day) {
  let done = 0;
  let notDone = 0;
  
  currentData.habits.forEach((habit, habitIndex) => {
    const cellKey = `${habitIndex}-${day}`;
    if (currentData.checkedCells[cellKey]) {
      done++;
    } else {
      notDone++;
    }
  });
  
  const total = done + notDone;
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;
  
  return { done, notDone, percent };
}

// Toggle cell checked state
async function toggleCell(habitIndex, day) {
  const cellKey = `${habitIndex}-${day}`;
  currentData.checkedCells[cellKey] = !currentData.checkedCells[cellKey];
  
  await saveData();
  renderDaysGrid();
  renderSummaryRow();
  updateStats();
}

// Update header stats
function updateStats() {
  const totalHabits = currentData.habits.length;
  document.getElementById('totalHabits').textContent = totalHabits;
  
  // Count total completed
  const completedCount = Object.values(currentData.checkedCells).filter(v => v).length;
  document.getElementById('completedCount').textContent = completedCount;
  
  // Calculate overall progress
  const daysInMonth = new Date(currentData.year, currentData.month + 1, 0).getDate();
  const totalPossible = totalHabits * daysInMonth;
  const progressPercent = totalPossible > 0 ? 
    Math.round((completedCount / totalPossible) * 100) : 0;
  
  document.getElementById('progressPercent').textContent = `${progressPercent}%`;
  document.getElementById('progressBar').style.width = `${progressPercent}%`;
}

// Setup event listeners
function setupEventListeners() {
  // Settings button
  document.getElementById('settingsBtn').addEventListener('click', openSettings);
  document.getElementById('closeSettings').addEventListener('click', closeSettings);
  
  // Edit habits button
  document.getElementById('editHabitsBtn').addEventListener('click', openEditHabits);
  document.getElementById('closeEditHabits').addEventListener('click', closeEditHabits);
  document.getElementById('saveHabitsBtn').addEventListener('click', saveHabits);
  document.getElementById('addHabitBtn').addEventListener('click', addNewHabitField);
  
  // Archive month button
  document.getElementById('archiveMonthBtn').addEventListener('click', archiveMonth);
  
  // Google Sheets connection
  document.getElementById('connectGoogleBtn').addEventListener('click', connectGoogleSheets);
  document.getElementById('saveSheetConfig').addEventListener('click', saveSheetConfig);
  
  // Close modals on background click
  document.getElementById('settingsModal').addEventListener('click', (e) => {
    if (e.target.id === 'settingsModal') closeSettings();
  });
  document.getElementById('editHabitsModal').addEventListener('click', (e) => {
    if (e.target.id === 'editHabitsModal') closeEditHabits();
  });
}

// Settings modal functions
function openSettings() {
  document.getElementById('settingsModal').classList.add('active');
  updateAuthStatus();
}

function closeSettings() {
  document.getElementById('settingsModal').classList.remove('active');
}

async function updateAuthStatus() {
  const stored = await chrome.storage.local.get(['accessToken', 'spreadsheetId']);
  const statusDiv = document.getElementById('authStatus');
  const sheetConfig = document.getElementById('sheetConfig');
  const connectBtn = document.getElementById('connectGoogleBtn');
  
  if (stored.accessToken) {
    statusDiv.textContent = 'Connected to Google';
    statusDiv.classList.add('connected');
    connectBtn.textContent = 'Disconnect';
    sheetConfig.style.display = 'block';
    
    if (stored.spreadsheetId) {
      document.getElementById('spreadsheetId').value = stored.spreadsheetId;
    }
  } else {
    statusDiv.textContent = 'Not connected';
    statusDiv.classList.remove('connected');
    connectBtn.textContent = 'Connect Google Sheets';
    sheetConfig.style.display = 'none';
  }
}

async function connectGoogleSheets() {
  const stored = await chrome.storage.local.get(['accessToken']);
  
  if (stored.accessToken) {
    // Disconnect
    await chrome.storage.local.remove(['accessToken', 'spreadsheetId']);
    currentData.isAuthenticated = false;
    currentData.spreadsheetId = null;
    updateAuthStatus();
  } else {
    // Connect
    try {
      const token = await chrome.runtime.sendMessage({ action: 'authenticate' });
      if (token) {
        await chrome.storage.local.set({ accessToken: token });
        currentData.isAuthenticated = true;
        updateAuthStatus();
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      alert('Failed to connect to Google Sheets. Please try again.');
    }
  }
}

async function saveSheetConfig() {
  const spreadsheetId = document.getElementById('spreadsheetId').value.trim();
  
  if (!spreadsheetId) {
    alert('Please enter a valid Spreadsheet ID');
    return;
  }
  
  await chrome.storage.local.set({ spreadsheetId });
  currentData.spreadsheetId = spreadsheetId;
  
  alert('Spreadsheet configuration saved!');
  
  // Initial sync
  await syncToGoogleSheets();
}

// Edit habits modal functions
function openEditHabits() {
  document.getElementById('editHabitsModal').classList.add('active');
  renderEditHabitsList();
}

function closeEditHabits() {
  document.getElementById('editHabitsModal').classList.remove('active');
}

function renderEditHabitsList() {
  const container = document.getElementById('habitsList');
  container.innerHTML = '';
  
  currentData.habits.forEach((habit, index) => {
    const item = document.createElement('div');
    item.className = 'habit-edit-item';
    item.innerHTML = `
      <input type="text" value="${habit}" data-index="${index}">
      <button onclick="deleteHabit(${index})">Delete</button>
    `;
    container.appendChild(item);
  });
}

function addNewHabitField() {
  const container = document.getElementById('habitsList');
  const item = document.createElement('div');
  item.className = 'habit-edit-item';
  item.innerHTML = `
    <input type="text" placeholder="New habit..." data-index="${currentData.habits.length}">
    <button onclick="deleteHabit(${currentData.habits.length})">Delete</button>
  `;
  container.appendChild(item);
}

window.deleteHabit = function(index) {
  const inputs = document.querySelectorAll('#habitsList input');
  inputs[index].parentElement.remove();
};

async function saveHabits() {
  const inputs = document.querySelectorAll('#habitsList input');
  const newHabits = [];
  
  inputs.forEach(input => {
    const value = input.value.trim();
    if (value) {
      newHabits.push(value);
    }
  });
  
  if (newHabits.length === 0) {
    alert('Please add at least one habit');
    return;
  }
  
  // Update habits and clear checked cells if habits changed
  const habitsChanged = JSON.stringify(currentData.habits) !== JSON.stringify(newHabits);
  
  if (habitsChanged) {
    if (confirm('Changing habits will reset your current progress. Continue?')) {
      currentData.habits = newHabits;
      currentData.checkedCells = {};
      await saveData();
      renderTracker();
      updateStats();
      closeEditHabits();
    }
  } else {
    currentData.habits = newHabits;
    await saveData();
    renderTracker();
    updateStats();
    closeEditHabits();
  }
}

// Archive month function
async function archiveMonth() {
  if (!confirm('Are you sure you want to archive this month? All data will be saved to Google Sheets (if connected) and cleared from the extension.')) {
    return;
  }
  
  // Sync to Google Sheets one last time
  if (currentData.isAuthenticated && currentData.spreadsheetId) {
    await syncToGoogleSheets();
  }
  
  // Create archive in local storage
  const archiveKey = `archive_${currentData.year}_${currentData.month}`;
  await chrome.storage.local.set({
    [archiveKey]: {
      month: currentData.month,
      year: currentData.year,
      habits: currentData.habits,
      checkedCells: currentData.checkedCells,
      archivedAt: new Date().toISOString()
    }
  });
  
  // Reset to current month
  const now = new Date();
  currentData.month = now.getMonth();
  currentData.year = now.getFullYear();
  currentData.checkedCells = {};
  
  await saveData();
  renderTracker();
  updateStats();
  
  alert('Month archived successfully!');
}

// Google Sheets sync function
async function syncToGoogleSheets() {
  if (!currentData.isAuthenticated || !currentData.spreadsheetId) {
    return;
  }
  
  try {
    const stored = await chrome.storage.local.get(['accessToken']);
    const accessToken = stored.accessToken;
    
    // Prepare data for Google Sheets
    const sheetData = prepareSheetData();
    
    // Send to background script to handle API call
    await chrome.runtime.sendMessage({
      action: 'syncToSheets',
      spreadsheetId: currentData.spreadsheetId,
      data: sheetData,
      accessToken: accessToken
    });
    
    console.log('Synced to Google Sheets successfully');
  } catch (error) {
    console.error('Failed to sync to Google Sheets:', error);
  }
}

// Prepare data for Google Sheets format
function prepareSheetData() {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const sheetName = `${monthNames[currentData.month]} ${currentData.year}`;
  
  const daysInMonth = new Date(currentData.year, currentData.month + 1, 0).getDate();
  
  // Build header row
  const headerRow = ['Habit', ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  
  // Build data rows
  const dataRows = currentData.habits.map((habit, habitIndex) => {
    const row = [habit];
    for (let day = 1; day <= daysInMonth; day++) {
      const cellKey = `${habitIndex}-${day}`;
      row.push(currentData.checkedCells[cellKey] ? '✓' : '');
    }
    return row;
  });
  
  return {
    sheetName,
    values: [headerRow, ...dataRows]
  };
}
