let source = null;
let timeout;

function updateBadge(length) {
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
        if (patternMatch || hostMatch) {
            timeout  = setTimeout(() => chrome.runtime.sendMessage({text: 'pursue-process', body: source, url: document.location.href, body: document.documentElement.outerHTML}), source.delay);
            contentObserver.observe(document.body, { subtree: true, childList: true });
        }
    });
});

var contentObserver = new MutationObserver(() => {
    let length = document.querySelectorAll(source.validationSelector).length;
    if (length === 0)
        return;

    length = document.querySelectorAll(source.contentSelector).length;
    if (length === 0)
        return;
    
    updateBadge(length);
    clearTimeout(timeout);
    timeout  = setTimeout(() => chrome.runtime.sendMessage({text: 'pursue-process', body: source, url: document.location.href, body: document.documentElement.outerHTML}), source.delay);
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.text === 'get-content') {
            sendResponse({ url: document.location.href, body: document.documentElement.outerHTML });
        } else if (request.text === 'get-availability')
            sendResponse(source);
        else if (request.text === 'action') {
            if (request.next) {
                const element = document.querySelector(request.next);
                if (element)
                    element.click();
            }
            sendResponse(null);
        }
    }
);