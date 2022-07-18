window.addEventListener('load', () => {
  const inputApikey = $('#input-api-key');

  chrome.storage.sync.get(['kimola_cognitive_api_key'], function(apikey) {
    inputApikey.val(apikey.kimola_cognitive_api_key);
  });

  $('#btn-save').on('click', (e) => {
    e.preventDefault();

    const button = $(e.target);
    button.prop('disabled', true);

    const apikey = inputApikey.val().trim();
    chrome.storage.sync.set({ 'kimola_cognitive_api_key': apikey });

    const div = $('#div-api-key');
    let bar = $('<div class="color-green fw-bolder text-center p-2 mt-3"><i class="fa-solid fa-check me-1"></i>The API key is successfully saved!</div>');
    div.append(bar);

    setTimeout(() => bar.fadeOut('slow', () => bar.remove()), 3500);
    button.prop('disabled', false);
  })
});