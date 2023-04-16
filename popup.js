function toggleGroupMembership() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const url = tabs[0].url;
    chrome.runtime.sendMessage({ action: 'checkUserInGroup', url }, response => {
      if (response && response.inGroup) {
        chrome.runtime.sendMessage({ action: 'removeFromGroup', url }, () => {
          window.location.reload();
        });
      } else {
        chrome.runtime.sendMessage({ action: 'addToGroup', url }, () => {
          window.location.reload();
        });
      }
    });
  });
}

function showGroupMembers() {
  const groupMembersList = document.getElementById('group-members-list');

  chrome.runtime.sendMessage({ action: 'getGroupMembers' }, response => {
    const groupMembers = response.groupMembers;
    
	//groupMembersList.innerHTML = '';
	groupMembersList.innerHTML = 'Total Profiles: ' + groupMembers.length;
	
	/*
    if (groupMembers.length === 0) {
      groupMembersList.innerHTML = 'No profiles added to the group.';
      return;
    }
	
    const h1 = document.querySelector('h1');
    groupMembers.forEach(url => {
      const profileName = h1 ? h1.innerText : url;
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = profileName;
      listItem.appendChild(link);
      groupMembersList.appendChild(listItem);
    });
	*/
  });
}

document.addEventListener('DOMContentLoaded', () => {

  const addButton = document.getElementById('my-group-extension-button');
  const groupMembersList = document.getElementById('group-members-list');
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const url = tabs[0].url;
    chrome.runtime.sendMessage({ action: 'checkUserInGroup', url }, response => {
      if (response && response.inGroup) {
        addButton.textContent = 'Remove From Group';
        addButton.classList.add('remove-button');
      } else {
        addButton.textContent = 'Add To Group';
      }
    });
  });
  addButton.addEventListener('click', toggleGroupMembership);

  // Display the list of group members in popup
  showGroupMembers();
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'groupMemberAdded' || request.action === 'groupMemberRemoved') {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const url = tabs[0].url;
      chrome.runtime.sendMessage({ action: 'checkUserInGroup', url }, response => {
        if (response && response.inGroup) {
          document.getElementById('my-group-extension-button').textContent = 'Remove From Group';
          document.getElementById('my-group-extension-button').classList.add('remove-button');
        } else {
          document.getElementById('my-group-extension-button').textContent = 'Add To Group';
          document.getElementById('my-group-extension-button').classList.remove('remove-button');
        }
      });
    });

    // Update the list of group members in popup
    showGroupMembers();
  }
});
