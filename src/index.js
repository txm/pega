/** Config
 *
 */
const channels = [
  'HomePage',
  'ServiceShop',
];


/** onlyUnique
 *
 */
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}


/** getSubchannels(aem_data: Object)
 *
 */
function getSubchannels(data) {
  const subchannels = [];
  for (const subchannel of data.data) {
    subchannels.push(subchannel.attributes['sub-channel']);
  }
  return subchannels.filter(onlyUnique);
}


/** orderBySubchannel(aem_data: Object)
 *
 */
function orderBySubchannel(data) {
  const subchannels = {};
  for (const subchannel of data.data) {
    if (!subchannels.hasOwnProperty(subchannel.attributes['sub-channel'])) {
      subchannels[subchannel.attributes['sub-channel']] = [];
    }
    subchannels[subchannel.attributes['sub-channel']].push(subchannel);
  }
  return subchannels;
}


/** renderChannel(aem_data: Object, pega_data: Object, channel: String)
 *
 */
function renderChannel(pega_data, aem_data, channel) {
  const subchannels = orderBySubchannel(pega_data);

  let channelHTML = `<div class="channel channel-${channel}"><h2>Channel: ${channel}</h2>`;
  for (const subchannel of Object.keys(subchannels)) {
    let subchannelHTML = `<div class="subchannel subchannel-${subchannel}"><h3>SubChannel: ${subchannel}</h3>`;

    for (const pega of subchannels[subchannel]) {
      let pegaHTML = `
          <h4>Data / Fields</h4>
          <h4>Pega</h4>
          <ul>
            <li><strong>type:</strong> ${pega.type}</li>
            <li><strong>id:</strong> ${pega.id}</li>
            <li><strong>attributes</strong>
            <ul>
              <li><strong>campaign-id:</strong> ${pega.attributes['campaign-id']}</li>
              <li><strong>product-id:</strong> ${pega.attributes['product-id']}</li>
              <li><strong>rank:</strong> ${pega.attributes['rank']}</li>
              <li><strong>sub-channel:</strong> ${pega.attributes['sub-channel']}</li>
            </ul>
            </li>
          </ul>
          <h4>AEM</h4>
          <ul>
      `;


      for (const treatment of aem_data[subchannel]) {
        pegaHTML += `
          <li><strong>Caveat:</strong> ${treatment.Caveat}</li>
          <li><strong>IncentiveDescription:</strong> ${treatment.IncentiveDescription}</li>
          <li><strong>Rank:</strong> ${treatment.Rank}</li>
          <li><strong>Subline:</strong> ${treatment.Subline}</li>
          <li><strong>TreatmentId:</strong> ${treatment.TreatmentId}</li>
        `;
      }

      pegaHTML += `
          </ul>
        <hr />
      `;

      subchannelHTML += pegaHTML;
    }

    subchannelHTML += `</div>`;
    channelHTML += subchannelHTML;
  }
  channelHTML += `</div>`;
  return channelHTML;
}

/** callMS(channel);
 *
 */
function callMS(channel) {
  return new Promise((resolve, reject) => {
    const pega_api = `/api/pega/${channel}.json`;
    const aem_api = `/api/aem/${channel}.json`;

    // get PEGA content
    const pega_promise = fetch(pega_api)
      .then(response => response.json())
      .catch(err => reject(Error(err)));

    // get AEM content
    const aem_promise = fetch(aem_api)
      .then(response => response.json())
      .catch(err => reject(Error(err)));

    // execute above promises
    Promise.all([pega_promise, aem_promise])
      .then(values => resolve(values))
      .catch(err => reject(Error(err)));
  });
}
