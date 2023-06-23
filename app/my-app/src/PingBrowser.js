const request = require("superagent");

const FRONTEND = 'http://indiemarketingtool.com/'

const ping = (url, picker) => {
  var t0 = new Date();

  return request
    .get(FRONTEND + url)
    .set('Access-Control-Allow-Origin', '*')
    .then(response => {
      var b = picker ? picker(response) : response.body;

      var t1 = new Date();
      var diff_ms = t1.getTime() - t0.getTime();

      // console.log('Data update took ' + diff_ms + 'ms');

      return b;
    })
    .catch(err => {
      //console.error('ERROR IN PING.BROWSER.JS', Object.keys(err), err.status, err);

      return [];
    })
}

const post = (url, parameters = {}) => {
  return request
    .post(FRONTEND + url)
    .set('Access-Control-Allow-Origin', '*')
    .send(parameters)
    .then(response => {
      return response.body;
    })
    .catch(err => {
      //console.error('ERROR IN PING.BROWSER.JS', Object.keys(err), err.status, err);

      return [];
    })
}

module.exports = {
  ping,
  post,
};