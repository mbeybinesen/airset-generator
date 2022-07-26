import generateAirset from './functions.js';

let apiKey;
const apiUrl = 'https://api.kimola.com/v1/';

const divAvailable = $('#div-source-available');
const divUnavailable = $('#div-source-unavailable');
const divSetUp = $('#div-apikey-does-not-exists');

let spanSource = $('#span-source');
let spanSourceCount = $('#span-source-count');

let btnGenerate = $('#btn-generate');
let btnStop = $('#btn-stop');

chrome.storage.onChanged.addListener((meta) => {
  if (meta.tabs) {
    chrome.windows.getCurrent(window => {
      chrome.tabs.query({active: true, windowId: window.id}, tabs => {
        if (meta.tabs.oldValue && meta.tabs.oldValue[tabs[0].id] && meta.tabs.newValue[tabs[0].id] === undefined)
          setupView(tabs, null, { completed: true, name: meta.tabs.oldValue[tabs[0].id].name });
        else if (meta.tabs.oldValue[tabs[0].id] && meta.tabs.newValue[tabs[0].id])
            spanSourceCount.text(meta.tabs.newValue[tabs[0].id].index + ' reviews and counting...');
      });
    });
  }
})

window.addEventListener('load', () => {
  //check if setup process is completed
  chrome.storage.sync.get(['kimola_cognitive_api_key'], (data) => {
    apiKey = data.kimola_cognitive_api_key;
    if (apiKey) {
      //we have apiKey assigned. check teh active tab status.
      chrome.windows.getCurrent(window => {
        chrome.tabs.query({active: true, windowId: window.id}, tabs => {
          //check if the active tab is available
          chrome.tabs.sendMessage(tabs[0].id, { text: 'get-availability' }, (source) => {
            //if source is assigned but size property is useless, take source as null.
            if (source && (source.size === null || source.size === undefined || source.size === 0))
              source = null;
            if (source) {
              //if source is assigned display the action button.
              divAvailable.removeClass('d-none');
              if (!divUnavailable.hasClass('d-none'))
                divUnavailable.addClass('d-none');
              //display the source information
              spanSource.html((tabs[0].favIconUrl ? '<img class="height-16px my-auto me-1" src="' + tabs[0].favIconUrl + '" />' : '') + '<span class="my-auto">' + tabs[0].title + '</span>');
              spanSource.attr('title', tabs[0].title);
              spanSourceCount.text(source.size + (source.isContinuous ? '+' : '') + ' reviews').data('size', source.size).data('plus', source.isContinuous.toString());
              setupView(tabs, source, null);
            } else {
              //if source is not assigned, don't take any action and just make sure to display the right div.
              divUnavailable.removeClass('d-none');
              if (!divAvailable.hasClass('d-none'))
                divAvailable.addClass('d-none');
            }
          });
        });
      });
    }
    else {
      //kimola_cognitive_api_key is not assigned. display setup div.
      divSetUp.removeClass('d-none');
      $('#btn-setup').on('click', (e) => {
        e.preventDefault();
        if (chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
        } else {
          window.open(chrome.runtime.getURL('options.html'));
        }
      });
    }
  });
});

const displayMessage = (theme, message) => {
  //check theme set green if not exists
  theme = theme ?? 'green';
  let bar = $('<div class="border-rad-3px bg-color-' + theme + ' color-white fw-bolder text-center p-2 mt-3">' + message + '</div>');
  divAvailable.append(bar);
  //dispose bar after a small time period
  setTimeout(() => bar.fadeOut('slow', () => bar.remove()), 3500);
}

const setupView = (tabs, source, tag) => { 
  chrome.storage.local.get(['tabs'], (data) => {
    const leaps = data.tabs ?? {};
    if (leaps[tabs[0].id]) {
      if (source.isContinuous)
        setupStopButton();
      else {
        setupGenerateButton();
        btnGenerate.prop('disabled', true); //indicates that the button is busy now
        btnGenerate.html('<i class="fas fa-spinner fa-spin me-2"></i>Generating...');  //shows that the button is busy now
      }
    }
    else {
      setupGenerateButton();
      if (tag && tag.completed) {
        const size = spanSourceCount.data('size');
        const plus = spanSourceCount.data('plus');
        spanSourceCount.text(size + (plus ? '+' : '') + ' reviews');
        displayMessage('green', 'Airset for "' + tag.name + '" is created successfully!');
      }
    }
  });
}

const setupGenerateButton = () => {
  //first, hide btnStop then make it ready for the next use
  btnStop.removeClass('d-none').addClass('d-none').prop('disabled', false).html('');
  //then make btnGenerate ready state
  btnGenerate.removeClass('d-none').prop('disabled', false).text('Generate!');
    //let's set btnGenerate
  btnGenerate.off('click').on('click', (e) => {
    e.preventDefault();
    if (btnGenerate.prop('disabled')) //skip if the button is busy
      return;
    btnGenerate.prop('disabled', true); //indicates that the button is busy now
    btnGenerate.html('<i class="fas fa-spinner fa-spin me-2"></i>Generating...');  //shows that the button is busy now
    chrome.runtime.sendMessage({ apiKey, index: 0, code: null, next: null, text: 'start-process'}, (reply) => {
      if (reply.success && reply.message === 'continues')
        setupStopButton();
      else if (reply.success && reply.message === 'completed')
        btnGenerate.prop('disabled', false).text('Generate!');
      else if (!reply.success && reply.message === 'error') {
        displayMessage('yellow', 'An error has occurred...');
        btnGenerate.prop('disabled', false).text('Generate!');
      }
    });
  });
}

const setupStopButton = () => {
  //first, hide btnGenerate then make it ready for the next use
  btnGenerate.removeClass('d-none').addClass('d-none').prop('disabled', false).text('Generate!');
  //then make btnStop to give information about the process
  btnStop.removeClass('d-none').html('<i class="fa-solid fa-circle-stop me-2"></i>Continuing...');
  //let's set btnStop
  btnStop.off('click').on('click', (e) => {
    e.preventDefault();
    if (btnStop.prop('disabled')) //skip if the button is busy
      return;
    btnStop.prop('disabled', true); //indicates that the button is busy now
    btnStop.html('<i class="fas fa-spinner fa-spin me-2"></i>Stopping...');  //shows that the button is busy now
    chrome.runtime.sendMessage({ text: 'stop-process'});
  });
}