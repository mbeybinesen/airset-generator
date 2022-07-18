var source = null;

function sendUpdateTabs() {
    let length = document.querySelectorAll(source.contentSelector).length;
    if (length !== source.size) {
        source.size = length;
        chrome.runtime.sendMessage({text: 'update-tabs', body: source}); 
    }
}

window.addEventListener('load', () => {
    chrome.storage.sync.get(['kimola_cognitive_airset_sources'], function(sources) {
        for (let i in sources.kimola_cognitive_airset_sources) {
            let regex = new RegExp(sources.kimola_cognitive_airset_sources[i].pattern);
            if (regex.test(document.location.href)) {
                source = sources.kimola_cognitive_airset_sources[i];
                break;
            }
        }
        console.log('content.js: this web site matches with a source!');
        if (source) {
            let validationElement = document.querySelector(source.validationSelector);
            if (validationElement === null) {
                console.log('content.js: validation element is null, observation of the document.body has been started...');
                validationObserver.observe(document.body, { subtree: true, childList: true });
            }
            else {
                console.log('content.js: validation element is found! now, observing content...');
                sendUpdateTabs();
                contentObserver.observe(document.querySelector(source.validationSelector), { subtree: true, childList: true });
            }
        }
    });
});

var validationObserver = new MutationObserver(function() {
    if (document.querySelectorAll(source.validationSelector).length > 0) {
        validationObserver.disconnect();
        console.log('observation of the document.body has been stopped.');
        sendUpdateTabs();
        contentObserver.observe(document.querySelector(source.validationSelector), { subtree: true, childList: true });
    }
});

var contentObserver = new MutationObserver(function() {
    if (document.querySelectorAll(source.validationSelector).length > 0) {
        console.log('observing content continues...');
        sendUpdateTabs();
    }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.text === 'get-content') {
            let url = 'https://api.kimola.com/v1/cognitive/airsets?url=' + encodeURIComponent(document.location.href);
            sendResponse({ url, body: document.documentElement.outerHTML });
        } else if (request.text === 'get-availability')
            sendResponse(source);
    }
  );