const apiUrl = 'https://localhost:7142/v1/';

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

export { apiUrl, generateAirset }