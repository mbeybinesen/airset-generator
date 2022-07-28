let source = null;
let timeout;

window.addEventListener('load', () => {
    chrome.storage.sync.get(['sources1', 'sources2', 'sources3', 'sources4', 'sources5'], (data) => {
        const sources = [ ...(data.sources1 ?? []), ...(data.sources2 ?? []), ...(data.sources3 ?? []), ...(data.sources4 ?? []), ...(data.sources5 ?? []) ];
        let hostMatch = false, patternMatch = false;
        for (let i in sources) {
            let regex = new RegExp(sources[i].pattern);
            if (regex.test(document.location.href)) {
                patternMatch = true;
                hostMatch = true;
                source = sources[i];
                break;
            }
            if (sources[i].host === document.location.host) {
                patternMatch = false;
                hostMatch = true;
                source = sources[i];
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
    let length = 0, count = 0, size = 0;

    length = document.querySelectorAll(source.validationSelector).length;
    if (length === 0) {
        source.count = 0;
        source.size = 0;
        chrome.runtime.sendMessage({text: 'update-tabs', body: source}); 
        return;
    }

    length = document.querySelectorAll(source.contentSelector).length;
    if (length === 0) {
        source.count = 0;
        source.size = 0;
        chrome.runtime.sendMessage({text: 'update-tabs', body: source}); 
        return;
    }

    count = document.querySelectorAll(source.contentSelector).length;
    size = document.querySelector(source.contentSelector).outerHTML.length;

    if (count === source.count && size === source.size)
        return;
    
    source.count = count;
    source.size = size;
    chrome.runtime.sendMessage({text: 'update-tabs', body: source}); 
    
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