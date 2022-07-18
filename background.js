function setSources() {
  fetch('https://api.kimola.com/v1/cognitive/airsets/sources')
  .then(response => response.json())
  .then(json => chrome.storage.sync.set({ 'kimola_cognitive_airset_sources': json }))
}

chrome.runtime.onInstalled.addListener(() => {
  this.setSources();
});

chrome.runtime.onStartup.addListener(() => {
  this.setSources();
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.text === 'update-tabs') {
      if (sender && sender.tab && sender.tab.id) {
        chrome.storage.local.get(['kimola_cognitive_tabs'], function(data) {
          let tabs = data.kimola_cognitive_tabs ?? {};
          if (request.body)
            tabs[sender.tab.id] = request.body;
          else
            delete tabs[sender.tab.id];
          chrome.storage.local.set({'kimola_cognitive_tabs': tabs});
          chrome.storage.local.set({'kimola_cognitive_source': request.body});
          chrome.action.setBadgeText({ tabId: sender.tab.id, text: request.body.size === 0 ? '' : request.body.size.toString() });
          chrome.action.setBadgeBackgroundColor({ tabId: sender.tab.id, color: '#fd4e26' });
        });
      }
      return true;
    } else if (request.text === 'generate-airset') {
      chrome.storage.sync.get(['kimola_cognitive_api_key'], function(apikey) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {text: 'get-content'}, function(reply) {
            fetch(reply.url, { method: 'POST', headers: { 'accept': '*/*', 'Content-Type': 'application/json-patch+json', 'Authorization': 'Bearer ' + apikey.kimola_cognitive_api_key }, body: JSON.stringify(reply.body) })
              .then(response => response.json())
              .then(json => sendResponse(json));
          });
        });
      });


      return true;
    } else if (request.text === 'get-availability') {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, {text: 'get-availability'}, function(reply) {
            sendResponse(reply);
          });
          return true;
        }
        else
          sendResponse(null);
      });
      return true;
    }
  }
);