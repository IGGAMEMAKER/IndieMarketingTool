var crypto = require('crypto');
const {SHA_SECRET} = require("../CD/Configs");

const secret = SHA_SECRET;

function sha(text){
  var hash = crypto.createHmac('sha256', secret)
    .update(text)
    .digest('hex');

  return hash;
}

// var phrase = 'I luv pitsa1'
// var code = sha(phrase)
// console.log({code}, code.toLowerCase() === sha(phrase).toLowerCase())

module.exports = {
  sha,
}