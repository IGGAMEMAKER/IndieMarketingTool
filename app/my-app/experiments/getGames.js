// var ping = import('../src/PingBrowser')
var request = require('superagent')
var {ScrappedGameModel} = require('../server/Models.js')
var a = new ScrappedGameModel({
  contacts: {

  }
})



request
  .get('http://api.steampowered.com/ISteamApps/GetAppList/v0002/?key=STEAMKEY&format=json')
  .set('Access-Control-Allow-Origin', '*')
  .then(response => {
    var games = response.body.applist.apps

    console.log(games)
    // var b = picker ? picker(response) : response.body;
    //
    // var t1 = new Date();
    // var diff_ms = t1.getTime() - t0.getTime();

    // console.log('Data update took ' + diff_ms + 'ms');

    // return b;
    return games
  })
  .catch(err => {
    //console.error('ERROR IN PING.BROWSER.JS', Object.keys(err), err.status, err);

    return [];
  })
  .then(games => {
    var sorted = games.sort((g1, g2) => g1.appid - g2.appid)

    console.log(sorted)
  })