window.addEventListener('load', () => {
  let divAvailable = $('#div-source-available');
  let divUnavailable = $('#div-source-unavailable');
  let divSetUp = $('#div-apikey-does-not-exists');
  chrome.storage.sync.get(['kimola_cognitive_api_key'], function(apikey) {
    if (apikey.kimola_cognitive_api_key) {
      chrome.runtime.sendMessage({text: 'get-availability'}, function(source) {
        if (source && (source.size === null || source.size === undefined || source.size === 0))
          source = null;
    
        if (source) {
          divAvailable.removeClass('d-none');
          if (!divUnavailable.hasClass('d-none'))
            divUnavailable.addClass('d-none');
          let spanName = $('#spn-source-name');
          let btnGenerate = $('#btn-generate');
          spanName.text(source.name);
          btnGenerate.unbind('click').bind('click', (e) => {
            e.preventDefault();
            btnGenerate.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>Generating...');
            chrome.runtime.sendMessage({text: 'generate-airset'}, function(response) {
              if (response.status === 'ok') {
                let bar = $('<div class="border-rad-3px bg-color-green color-white fw-bolder text-center p-2 mt-3">Airset "' + response.body.name + '" has been successfully created!</div>');
                divAvailable.append(bar);
                setTimeout(() => bar.fadeOut('slow', () => bar.remove()), 3500);
                btnGenerate.prop('disabled', false).text('Generate!');
              }
            });
          });
        } else {
          divUnavailable.removeClass('d-none');
          if (!divAvailable.hasClass('d-none'))
            divAvailable.addClass('d-none');
        }
      });
    }
    else {
      divSetUp.removeClass('d-none');
      $('#btn-setup').on('click', () => {
        if (chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
        } else {
          window.open(chrome.runtime.getURL('options.html'));
        }
      })
    }
  });
});