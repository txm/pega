function callMS(channel) {
  return new Promise(function(resolve, reject) {
    const aem_api = `http://pi.txm.net/api/aem/${channel}.json`;
    const pega_api = `http://pi.txm.net/api/pega/${channel}.json`;

    // get AEM content
    const aem_promise = fetch(aem_api)
      .then(response => response.json())
      .catch(err => console.error(err));

    // get PEGA content
    const pega_promise = fetch(pega_api, { method: "GET" })
      .then(response => response.json())
      .catch(err => reject(Error(err));

    // execute above promises
    Promise.all([aem_promise, pega_promise])
      .then(values => {

        const aem_json = values[0];
        const pega_json = values[1];

        // fin!
        resolve(values);
      })
      .catch(err => reject(Error(err));

  });
}
