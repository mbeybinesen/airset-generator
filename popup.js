import { apiUrl } from './functions.js';

let apiKey;

const divAvailable = $('#div-source-available');
const divUnavailable = $('#div-source-unavailable');
const divSetUp = $('#div-apikey-does-not-exists');
const divAirsets = $('#div-airsets');

let spanSource = $('#span-source');
let spanSourceCount = $('#span-source-count');

let btnGenerate = $('#btn-generate');
let btnStop = $('#btn-stop');

const getAirsets = () => {
  fetch(apiUrl + 'cognitive/airsets?pageSize=5', { method: 'GET', headers: { 'accept': '*/*', 'Content-Type': 'application/json-patch+json', 'Authorization': 'Bearer ' + apiKey } })
  .then(response => response.json())
  .then(json => {
    divAirsets.html('');
    if (json.items.length > 0) {
      let ul = $('<ul class="list-style-none ps-1 my-2"></ul>');
      for (let i = 0; i < json.items.length; i++)
        ul.append('<li class="mb-2"><a href="https://cognitive.kimola.com/airsets/' + json.items[i].sourceUrl + '/overview" target="_blank" class="d-inline-block d-flex hover text-truncate d-flex"><span class="d-iline-block me-2 my-auto" style="background-image: url(\'' + json.items[i].iconUrl + '\'); background-position: 50% 50%; background-size: contain; background-repeat: no-repeat; width: 18px; height: 18px;" title="' + json.items[i].name + '"></span><span class="d-inline-block  line-height-1_0em my-auto">' + json.items[i].name + (json.items[i].size > 1 ? (' (' + json.items[i].size + ' reviews)') : '') + '</span></a></li>');
      divAirsets.append('<span class="fw-bold d-block mt-5">Latest Airsets</span>');
      divAirsets.append(ul);
      divAirsets.append('<a href="https://cognitive.kimola.com/airsets" target="_blank" class="fw-semibold d-inline-block hover mt-2">All Airsets<i class="fa-solid fa-angle-right ms-1"></i></a>');
    }
  })
}

chrome.storage.onChanged.addListener((meta) => {
  if (meta.tabs) {
    chrome.windows.getCurrent(window => {
      chrome.tabs.query({active: true, windowId: window.id}, tabs => {
        if (meta.tabs.oldValue && meta.tabs.oldValue[tabs[0].id] && meta.tabs.newValue[tabs[0].id] === undefined)
          setupView(tabs, null, { completed: true, name: meta.tabs.oldValue[tabs[0].id].name });
        else if (meta.tabs.oldValue && meta.tabs.oldValue[tabs[0].id] && meta.tabs.newValue && meta.tabs.newValue[tabs[0].id])
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
            //if source is assigned but count property is useless, take source as null.
            if (source && (source.count === null || source.count === undefined || source.count === 0))
              source = null;
            if (source) {
              //if source is assigned display the action button.
              divAvailable.removeClass('d-none');
              if (!divUnavailable.hasClass('d-none'))
                divUnavailable.addClass('d-none');
              //display the source information
              spanSource.html((tabs[0].favIconUrl ? '<img class="height-16px my-auto me-1" src="' + tabs[0].favIconUrl + '" />' : '') + '<span class="my-auto">' + tabs[0].title + '</span>');
              spanSource.attr('title', tabs[0].title);
              spanSourceCount.text(source.count + (source.isContinuous ? '+' : '') + ' reviews').data('count', source.count).data('plus', source.isContinuous.toString());
              setupView(tabs, source, null);
              getAirsets();
            } else {
              //if source is not assigned, don't take any action and just make sure to display the right div.
              divUnavailable.removeClass('d-none');
              if (!divAvailable.hasClass('d-none'))
                divAvailable.addClass('d-none');
              chrome.storage.sync.get(['sources1', 'sources2', 'sources3', 'sources4', 'sources5'], (data) => {
                const sources = [ ...(data.sources1 ?? []), ...(data.sources2 ?? []), ...(data.sources3 ?? []), ...(data.sources4 ?? []), ...(data.sources5 ?? []) ];
                const div = $('<div class="w-100 d-flex my-2"></div>');
                const ul = $('<ul class="d-flex justify-content-center flex-wrap list-style-none w-75 mx-auto"></ul>');
                for (let i in sources) {
                  if (!sources[i].iconUrl)
                    continue;
                  const li = $('<li class="m-2"></li>');
                  if (sources[i].helpUrl)
                    li.append('<a href="' + sources[i].helpUrl + '" target="_blank" class="d-block" style="background-image: url(\'' + sources[i].iconUrl + '\'); background-position: 50% 50%; background-size: contain; background-repeat: no-repeat; width: 24px; height: 24px;" title="' + sources[i].name + '"></a>');
                  else
                    li.append('<span class="d-block" style="background-image: url(\'' + sources[i].iconUrl + '\'); background-position: 50% 50%; background-size: contain; background-repeat: no-repeat; width: 24px; height: 24px;" title="' + sources[i].name + '"></span>');
                  ul.append(li);
                }
                div.append(ul);
                divUnavailable.append('<span class="fw-bold text-center d-block mt-4">Supported Mediums</span>');
                divUnavailable.append(div);
              });
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
        const count = spanSourceCount.data('count');
        const plus = spanSourceCount.data('plus') === 'true';
        spanSourceCount.text(count + (plus ? '+' : '') + ' reviews');
        displayMessage('green', 'Airset for "' + tag.name + '" is created successfully!');
        getAirsets();
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