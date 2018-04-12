"use strict";

function callMS(channel) {
  return new Promise(function (resolve, reject) {
    var aem_api = "http://pi.txm.net/api/aem/" + channel + ".json";
    var pega_api = "http://pi.txm.net/api/pega/" + channel + ".json";

    // get AEM content
    var aem_promise = fetch(aem_api).then(function (response) {
      return response.json();
    }).catch(function (err) {
      return console.error(err);
    });

    // get PEGA content
    var pega_promise = fetch(pega_api, { method: "GET" }).then(function (response) {
      return response.json();
    }).catch(function (err) {
      return console.error(err);
    });

    // execute above promises
    Promise.all([aem_promise, pega_promise]).then(function (values) {

      var aem_json = values[0];
      var pega_json = values[1];

      // fin!
      resolve(values);
    }).catch(function (err) {
      return console.error(err);
    });
  });
}