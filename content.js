function getUserIdFromUrl() {
  const url = window.location.href;
  const userIdMatch = url.match(/(facebook\.com\/)(profile\.php\?id=\d+|[a-zA-Z0-9.]+)(\/?)/);

  if (userIdMatch && userIdMatch.length > 1) {
    const userId = userIdMatch[2];
    return userId;
  }

  return null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleGroupMembership') {
    const userId = getUserIdFromUrl();
    if (!userId) return;

    chrome.runtime.sendMessage({ action: 'checkUserInGroup', url: window.location.href }, response => {
      if (response && response.inGroup) {
        chrome.runtime.sendMessage({ action: 'removeFromGroup', url: window.location.href }, () => {
			sendResponse({ success: true });
        });
      } else {
        chrome.runtime.sendMessage({ action: 'addToGroup', url: window.location.href }, () => {
			sendResponse({ success: true });
        });
      }
    });
    return true;
  }
});

function showMyUserBox() {
	var addButtonBox = document.createElement('div');

	addButtonBox.style.position = 'fixed';
	addButtonBox.style.backgroundColor = '#4CAF50';
	addButtonBox.style.bottom = '15px';
	addButtonBox.style.left = '20px';
	addButtonBox.style.padding = '5px 10px';
	addButtonBox.style.borderRadius = '5px';
	addButtonBox.style.color = '#fff';
	addButtonBox.style.zIndex = '9999';
	addButtonBox.style.fontSize = '16px';
	addButtonBox.textContent = 'This is My Group User!';
	document.body.appendChild(addButtonBox);	
}

chrome.runtime.sendMessage({ action: 'checkUserInGroup', url: window.location.href }, response => {
  if (response && response.inGroup) {
	showMyUserBox();
  }
});
