/* global chrome */

async function isCSPDisabled(tabId) {
  const data = await chrome.storage.local.get('disabledTabIds');
  return data.disabledTabIds.includes(tabId);
}

async function updateUI(tabId) {
  const isDisabled = await isCSPDisabled(tabId);
  const iconName = (isDisabled) ? 'on' : 'off';
  const title = (isDisabled) ? 'disabled' : 'enabled';

  chrome.action.setIcon({ path: `images/icon38-${iconName}.png` });
  chrome.action.setTitle({ title: `Content-Security-Policy headers are ${title} for this tab` });
}

async function toggleDisableCSP(tabId) {
  const isDisabled = await isCSPDisabled(tabId);
  const original = await chrome.storage.local.get('disabledTabIds');
  let newDisabledTabIds;

  if (isDisabled) {
    // remove this tabId from disabledTabIds
    newDisabledTabIds = original.disabledTabIds.filter((val) => val !== tabId);
  } else {
    newDisabledTabIds = original.disabledTabIds.concat(tabId);
  }

  // update local storage of disabled tab IDs
  chrome.storage.local.set({ disabledTabIds: newDisabledTabIds });

  // update the header blocking rules
  if (newDisabledTabIds.length == 0) {
    chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [1]
    });
  } else {
    chrome.declarativeNetRequest.updateSessionRules({
      addRules: [{
        id: 1,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          responseHeaders: [{
            header: 'content-security-policy',
            operation: 'remove',
          }],
        },
        condition: {
          tabIds: newDisabledTabIds,
          resourceTypes: ["main_frame", "sub_frame"]
        },
      }],
      removeRuleIds: [1],
    });
  }

  updateUI(tabId);
}

function init() {
  // List of tabIds where CSP headers are disabled
  chrome.storage.local.set({ disabledTabIds: [] });

  // When the user clicks the plugin icon
  chrome.action.onClicked.addListener((tab) => {
    toggleDisableCSP(tab.id);
  });

  // When the user changes tab
  chrome.tabs.onActivated.addListener((activeInfo) => {
    updateUI(activeInfo.tabId);
  });

  chrome.tabs.onUpdated.addListener((tabId) => {
    isCSPDisabled(tabId)
      .then((isDisabled) => {
        if (isDisabled) {
          // Remove Service Workers, to remove (Application) Cache storage.
          // Sites that use Application Cache to cache their HTML document
          // will not trigger a request, and therefore this extension will not
          // be able to remove Content-Security-Policy from the response.
          //
          // An example page is https://web.whatsapp.com
          //
          // using chrome.browsingData.removeCacheStorage() doesn't work as
          // expected for some reason
          chrome.browsingData.removeServiceWorkers({});
        }
      });
  });
}

init();
