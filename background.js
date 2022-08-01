import { apiUrl, generateAirset } from './functions.js';

let apiKey;

const setSources = () => {
  fetch(apiUrl + 'cognitive/airsets/sources')
  .then(response => response.json())
  .then(json => {
    let sources = { sources1: [], sources2: [], sources3: [], sources4: [], sources5: [] };
    let iteration = 1, key;
    for (let i = 0; i < json.length; i++) {
      key = `sources${iteration}`;
      sources[key].push(json[i]);
      if (sources[key].length === 10 || i === json.length - 1) {
        if (iteration == 1)
          chrome.storage.sync.set({ 'sources1': sources.sources1 });
        else if (iteration == 2)
          chrome.storage.sync.set({ 'sources2': sources.sources2 });
        else if (iteration == 3)
          chrome.storage.sync.set({ 'sources3': sources.sources3 });
        else if (iteration == 4)
          chrome.storage.sync.set({ 'sources4': sources.sources4 });
        else if (iteration == 5)
          chrome.storage.sync.set({ 'sources5': sources.sources5 });
        iteration++;
      }
    }
  })
}

chrome.runtime.onInstalled.addListener(() => {
  setSources();
});

chrome.runtime.onStartup.addListener(() => {
  setSources();
  chrome.storage.local.remove(['tabs', 'source']);
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.text === 'update-tabs') {
      if (sender && sender.tab && sender.tab.id) {
        chrome.storage.local.set({'source': request.body});
        chrome.action.setBadgeText({ tabId: sender.tab.id, text: request.body.count === 0 ? '' : request.body.count.toString() });
        chrome.action.setBadgeBackgroundColor({ tabId: sender.tab.id, color: '#fd4e26' });
      }
    } else if (request.text === 'start-process') {
      chrome.storage.local.get(['tabs'], (data) => {
        const leaps = data.tabs ?? {};
        chrome.windows.getCurrent(window => {
          chrome.tabs.query({active: true, windowId: window.id}, tabs => {
            chrome.tabs.sendMessage(tabs[0].id, { text: 'get-content'}, (reply) => {
              leaps[tabs[0].id] = { isWorking: true };
              chrome.storage.local.set({ 'tabs': leaps });
              generateAirset(request.apiKey, reply.url, null, null, null, reply.body)
              .then((result) => {
                leaps[tabs[0].id] = { ...leaps[tabs[0].id], index: result.index, code: result.code, name: result.name, next: result.next };
                if (result.next) {
                  chrome.storage.local.set({ 'tabs': leaps }, () => {
                    sendResponse({ success: true, message: 'continues', body: result });
                    console.log('background.js / continues / sendMessage gidecek');
                    chrome.tabs.sendMessage(tabs[0].id, { next: result.next, text: 'action' });
                    console.log('background.js / continues / sendMessage gitti');
                  });
                }
                else {
                  chrome.storage.local.set({ 'tabs': leaps }, () => {
                    delete leaps[tabs[0].id];
                    chrome.storage.local.set({ 'tabs': leaps }, () => sendResponse({ success: true, message: 'completed' }));
                  });
                }
              })
              .catch((error) => {
                delete leaps[tabs[0].id];
                chrome.storage.local.set({ 'tabs': leaps }, () => sendResponse({ success: false, message: 'error', body: error }));
              });
            });
          });
        });
      });
      console.log('background.js / start-process / true donecek');
      return true; // keep the messaging channel open to call sendResponse
    } else if (request.text === 'pursue-process') {
      chrome.storage.local.get(['tabs'], (data) => {
        let leaps = data.tabs ?? {};
        chrome.windows.getCurrent(window => {
          chrome.tabs.query({active: true, windowId: window.id}, tabs => {
            let process = leaps[tabs[0].id];
            if (process && tabs[0].id === sender.tab.id) {
              if (process.isWorking) {
                chrome.storage.sync.get(['kimola_cognitive_api_key'], (data) => {
                  apiKey = data.kimola_cognitive_api_key;
                  chrome.tabs.sendMessage(tabs[0].id, { text: 'get-content'}, (reply) => {
                    generateAirset(apiKey, reply.url, process.index, process.code, process.next, reply.body)
                    .then((result) => {
                      if (result.next) {
                        chrome.storage.local.get(['tabs'], (data) => { 
                          leaps = data.tabs ?? {};
                          if (leaps[tabs[0].id]) {
                            if (leaps[tabs[0].id].isWorking) {
                              leaps[tabs[0].id] = { ...leaps[tabs[0].id], index: result.index, next: result.next };
                              chrome.storage.local.set({'tabs': leaps}, () => {
                                chrome.tabs.sendMessage(tabs[0].id, { next: process.next, text: 'action' });
                                return true;
                              });
                            }
                            else {
                              delete leaps[tabs[0].id];
                              chrome.storage.local.set({'tabs': leaps}, () => { return true; });
                            }
                          }
                          else
                            return true;
                        });
                      }
                      else {
                        delete leaps[tabs[0].id];
                        chrome.storage.local.set({'tabs': leaps}, () => { return true; });
                      }
                    })
                    .catch(() => {
                      delete leaps[tabs[0].id];
                      chrome.storage.local.set({'tabs': leaps}, () => { return true; });
                    })
                  });
                });
              } else {
                delete leaps[tabs[0].id];
                //chrome.storage.local.set({'tabs': leaps}, () => { return true; });
                chrome.storage.local.set({'tabs': leaps});
              }
            }
            else {
              console.log('background.js / pursue-process / request', request);
              console.log('background.js / pursue-process / sender', sender);
              //return true;
            }
          });
        })
      });
      // console.log('background.js / pursue-process / true donecek');
      // return true; // keep the messaging channel open to call sendResponse
    } else if (request.text === 'stop-process') {
      chrome.storage.local.get(['tabs'], (data) => {
        const leaps = data.tabs ?? {};
        chrome.windows.getCurrent(window => {
          chrome.tabs.query({active: true, windowId: window.id}, tabs => {
            const process = leaps[tabs[0].id];
            leaps[tabs[0].id] = { ...process, isWorking: false };
            chrome.storage.local.set({'tabs': leaps}, () => { return true; });
            setTimeout(() => { 
              chrome.windows.getCurrent(window => {
                chrome.tabs.query({active: true, windowId: window.id}, tabs => {
                  const process = leaps[tabs[0].id];
                  delete leaps[tabs[0].id];  
                  chrome.storage.local.set({'tabs': leaps}, () => { return true; });
                })
              })
            }, 5000);
          });
        })
      });
      // console.log('background.js / stop-process / true donecek');
      // return true; // keep the messaging channel open to call sendResponse
    }
  }
);