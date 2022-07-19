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
        let hostMatch = false, patternMatch = false;
        for (let i in sources.kimola_cognitive_airset_sources) {
            let regex = new RegExp(sources.kimola_cognitive_airset_sources[i].pattern);
            if (regex.test(document.location.href)) {
                patternMatch = true;
                hostMatch = true;
                source = sources.kimola_cognitive_airset_sources[i];
                break;
            }
            regex = new RegExp(sources.kimola_cognitive_airset_sources[i].host);
            if (regex.test(document.location.host)) {
                patternMatch = false;
                hostMatch = true;
                source = sources.kimola_cognitive_airset_sources[i];
                break;
            }
        }
        if (patternMatch) {
            let validationElement = document.querySelector(source.validationSelector);
            if (validationElement === null) {
                validationObserver.observe(document.body, { subtree: true, childList: true });
            }
            else {
                sendUpdateTabs();
                contentObserver.observe(document.querySelector(source.validationSelector), { subtree: true, childList: true });
            }
        }
        else if (hostMatch) {
            validationObserver.observe(document.body, { subtree: true, childList: true });
        }
    });
});

var validationObserver = new MutationObserver(function() {
    if (document.querySelectorAll(source.validationSelector).length > 0) {
        sendUpdateTabs();
        contentObserver.observe(document.querySelector(source.validationSelector), { subtree: true, childList: true });
    }
});

var contentObserver = new MutationObserver(function() {
    if (document.querySelectorAll(source.validationSelector).length > 0) {
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