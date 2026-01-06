chrome.runtime.onInstalled.addListener(() => {
  setupDailyReset();
  checkAndResetIfNeeded();
});

chrome.runtime.onStartup.addListener(() => {
  setupDailyReset();
  checkAndResetIfNeeded();
});

function setupDailyReset() {
  chrome.alarms.clear('dailyReset', () => {
    const now = new Date();
    const next7AM = new Date();
    next7AM.setHours(7, 0, 0, 0);
    
    if (now.getHours() >= 7) {
      next7AM.setDate(next7AM.getDate() + 1);
    }
    
    const delayInMinutes = (next7AM.getTime() - now.getTime()) / 60000;
    
    chrome.alarms.create('dailyReset', {
      delayInMinutes: delayInMinutes,
      periodInMinutes: 1440
    });
  });
}

function checkAndResetIfNeeded() {
  chrome.storage.local.get(['lastReset'], (result) => {
    const lastReset = result.lastReset || 0;
    const now = new Date();
    const today7AM = new Date();
    today7AM.setHours(7, 0, 0, 0);
    
    if (now >= today7AM && lastReset < today7AM.getTime()) {
      resetTodos();
    }
  });
}

function resetTodos() {
  chrome.storage.local.set({
    todos: [],
    lastReset: Date.now()
  });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyReset') {
    resetTodos();
  }
});