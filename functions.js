const apiUrl = 'https://api.kimola.com/v1/';

export default function generateAirset(apiKey, url, index, code, next, body) {
  const requestUrl = apiUrl + 'cognitive/airsets?url=' + encodeURIComponent(url) + (index ? ('&index=' + index) : '') + (code ? ('&code=' + code) : '') + (next ? ('&next=' + next) : '');
  console.log(requestUrl);
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