/* global chrome */

// List of tabIds where CSP headers are disabled
var disabledTabIds = [];

var isCSPDisabled = function (tabId) {
  return disabledTabIds.includes(tabId);
};

var toggleDisableCSP = function (tabId) {
  if (isCSPDisabled(tabId)) {
    // remove this tabId from disabledTabIds
    disabledTabIds = disabledTabIds.filter(function (val) {
      return val !== tabId;
    });
  } else {
    disabledTabIds.push(tabId);

    // Sites that use Application Cache to cache their HTML document means this
    // extension is not able to alter HTTP response headers (as there is no HTTP
    // request when serving documents from the cache).
    //
    // An example page that this fixes is https://web.whatsapp.com
    chrome.browsingData.remove({}, { serviceWorkers: true }, function () {});
  }

  updateUI(tabId);
};

var onHeadersReceived = function (details) {
  if (!isCSPDisabled(details.tabId)) {
    return;
  }

  for (var i = 0; i < details.responseHeaders.length; i++) {
    if (details.responseHeaders[i].name.toLowerCase() === 'content-security-policy') {
      details.responseHeaders[i].value = '';
    }
  }

  return {
    responseHeaders: details.responseHeaders
  };
};

var updateUI = function (tabId) {
  var isDisabled = isCSPDisabled(tabId);
  var iconName = isDisabled ? 'on' : 'off';
  var title = isDisabled ? 'disabled' : 'enabled';

  chrome.browserAction.setIcon({ path: 'images/icon38-' + iconName + '.png' });
  chrome.browserAction.setTitle({ title: 'Content-Security-Policy headers are ' + title + ' for this tab' });
};

var init = function () {
  // When Chrome recieves some headers
  var onHeaderFilter = { urls: ['*://*/*'], types: ['main_frame', 'sub_frame'] };
  chrome.webRequest.onHeadersReceived.addListener(
    onHeadersReceived, onHeaderFilter, ['blocking', 'responseHeaders']
  );

  // When the user clicks the plugin icon
  chrome.browserAction.onClicked.addListener(function (tab) {
    toggleDisableCSP(tab.id);
  });

  // When the user changes tab
  chrome.tabs.onActivated.addListener(function (activeInfo) {
    updateUI(activeInfo.tabId);
  });

  // onAttached
};

init();
