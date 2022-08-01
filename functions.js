const apiUrl = 'https://api.kimola.com/v1/';

function generateAirset(apiKey, url, index, code, next, body) {
  const requestUrl = apiUrl + 'cognitive/airsets?url=' + encodeURIComponent(url) + (index ? ('&index=' + index) : '') + (code ? ('&code=' + code) : '') + (next ? ('&next=' + encodeURIComponent(next)) : '');
  return new Promise((resolve, reject) => {
    fetch(requestUrl, { method: 'POST', headers: { 'accept': '*/*', 'Content-Type': 'application/json-patch+json', 'Authorization': 'Bearer ' + apiKey }, body: JSON.stringify(body) })
      .then(response =>  {
        if (response.ok)
          return response.json();
        else
          return response.text().then(error => { throw ({ message: error, status: response.status }) });
      })
      .then((response) => {
        resolve(response);
      })
      .catch((response) => {
        reject(response);
      });
  });
}

function limit(text, length, suffix) {
  length = (suffix ? (length - suffix.length) : length);

  if (text.length > length)
  {
    let sub = text.substring(0, length);
    let index = sub.lastIndexOf(' ');

    text = `${(index > -1 ? text.substring(0, index) : sub).trim()}${suffix}`;
  }

  return text;
}

export { apiUrl, generateAirset, limit }