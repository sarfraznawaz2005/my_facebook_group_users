let groupMembers = [];

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ groupMembers: [] });
  // Request permission to display notifications
  if (Notification.permission !== 'granted') {
    Notification.requestPermission();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'addToGroup') {
    const url = request.url;
    chrome.storage.local.get(['groupMembers'], (result) => {
      groupMembers = result.groupMembers;
      if (!groupMembers.includes(url)) {
        groupMembers.push(url);
        chrome.storage.local.set({ groupMembers });
        sendResponse({ added: true });

        // Show desktop notification
        const notificationOptions = {
          icon: 'icon.png',
          title: 'Profile added to group',
		  timeout: 5000
        };
        self.registration.showNotification(notificationOptions.title, notificationOptions);
      }
    });
  } else if (request.action === 'removeFromGroup') {
    const url = request.url;
    chrome.storage.local.get(['groupMembers'], (result) => {
      groupMembers = result.groupMembers;
      const index = groupMembers.indexOf(url);
      if (index > -1) {
        groupMembers.splice(index, 1);
        chrome.storage.local.set({ groupMembers });
        sendResponse({ removed: true });

        // Show desktop notification
        const notificationOptions = {
          icon: 'icon.png',
          title: 'Profile removed from group',
		  timeout: 5000
        };
        self.registration.showNotification(notificationOptions.title, notificationOptions);
      }
    });
  } else if (request.action === 'getGroupMembers') {
    chrome.storage.local.get(['groupMembers'], (result) => {
      groupMembers = result.groupMembers;
      sendResponse({ groupMembers });
    });
    return true;
  } else if (request.action === 'checkUserInGroup') {
    const url = request.url;
    chrome.storage.local.get(['groupMembers'], (result) => {
      groupMembers = result.groupMembers;
      sendResponse({ inGroup: groupMembers.includes(url) });
    });
    return true;
  }
});
