var isActive = true;

var callback = function(details) {
  if (!isActive) {
      return;
  }

  for (var i = 0; i < details.responseHeaders.length; i++) {
    if ('content-security-policy' === details.responseHeaders[i].name.toLowerCase()) {
      details.responseHeaders[i].value = '';
    }
  }

  return {
    responseHeaders: details.responseHeaders
  };
};

var filter = {
  urls: ["*://*/*"],
  types: ["main_frame", "sub_frame"]
};

chrome.webRequest.onHeadersReceived.addListener(callback, filter, ["blocking", "responseHeaders"]);


chrome.browserAction.onClicked.addListener(function(tab) {
    var state = isActive ? 'off' : 'on';
    var details = {
        path: "images/icon38-" + state + ".png"
    };
    chrome.browserAction.setIcon(details);
    isActive = !isActive;
});
