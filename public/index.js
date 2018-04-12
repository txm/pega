'use strict';

/** Config
 *
 */
var channels = ['HomePage', 'ServiceShop'];

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
  var subchannels = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = data.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var subchannel = _step.value;

      subchannels.push(subchannel.attributes['sub-channel']);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return subchannels.filter(onlyUnique);
}

/** orderBySubchannel(aem_data: Object)
 *
 */
function orderBySubchannel(data) {
  var subchannels = {};
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = data.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var subchannel = _step2.value;

      if (!subchannels.hasOwnProperty(subchannel.attributes['sub-channel'])) {
        subchannels[subchannel.attributes['sub-channel']] = [];
      }
      subchannels[subchannel.attributes['sub-channel']].push(subchannel);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2.return) {
        _iterator2.return();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  return subchannels;
}

/** renderChannel(aem_data: Object, pega_data: Object, channel: String)
 *
 */
function renderChannel(pega_data, aem_data, channel) {
  var subchannels = orderBySubchannel(pega_data);

  var channelHTML = '<div class="channel channel-' + channel + '"><h2>Channel: ' + channel + '</h2>';
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = Object.keys(subchannels)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var subchannel = _step3.value;

      var subchannelHTML = '<div class="subchannel subchannel-' + subchannel + '"><h3>SubChannel: ' + subchannel + '</h3>';

      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = subchannels[subchannel][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var pega = _step4.value;

          var pegaHTML = '\n          <h4>Data / Fields</h4>\n          <h4>Pega</h4>\n          <ul>\n            <li><strong>type:</strong> ' + pega.type + '</li>\n            <li><strong>id:</strong> ' + pega.id + '</li>\n            <li><strong>attributes</strong>\n            <ul>\n              <li><strong>campaign-id:</strong> ' + pega.attributes['campaign-id'] + '</li>\n              <li><strong>product-id:</strong> ' + pega.attributes['product-id'] + '</li>\n              <li><strong>rank:</strong> ' + pega.attributes['rank'] + '</li>\n              <li><strong>sub-channel:</strong> ' + pega.attributes['sub-channel'] + '</li>\n            </ul>\n            </li>\n          </ul>\n          <h4>AEM</h4>\n          <ul>\n      ';

          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = aem_data[subchannel][Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var treatment = _step5.value;

              pegaHTML += '\n          <li><strong>Caveat:</strong> ' + treatment.Caveat + '</li>\n          <li><strong>IncentiveDescription:</strong> ' + treatment.IncentiveDescription + '</li>\n          <li><strong>Rank:</strong> ' + treatment.Rank + '</li>\n          <li><strong>Subline:</strong> ' + treatment.Subline + '</li>\n          <li><strong>TreatmentId:</strong> ' + treatment.TreatmentId + '</li>\n        ';
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }

          pegaHTML += '\n          </ul>\n        <hr />\n      ';

          subchannelHTML += pegaHTML;
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      subchannelHTML += '</div>';
      channelHTML += subchannelHTML;
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3.return) {
        _iterator3.return();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  channelHTML += '</div>';
  return channelHTML;
}

/** callMS(channel);
 *
 */
function callMS(channel) {
  return new Promise(function (resolve, reject) {
    var pega_api = '/api/pega/' + channel + '.json';
    var aem_api = '/api/aem/' + channel + '.json';

    // get PEGA content
    var pega_promise = fetch(pega_api).then(function (response) {
      return response.json();
    }).catch(function (err) {
      return reject(Error(err));
    });

    // get AEM content
    var aem_promise = fetch(aem_api).then(function (response) {
      return response.json();
    }).catch(function (err) {
      return reject(Error(err));
    });

    // execute above promises
    Promise.all([pega_promise, aem_promise]).then(function (values) {
      return resolve(values);
    }).catch(function (err) {
      return reject(Error(err));
    });
  });
}