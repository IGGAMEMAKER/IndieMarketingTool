const crypto = require('crypto')

const createRandomPassword = (
  length = 35,
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
) =>
  Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join('')

const createRandomEmail = (len) => createRandomPassword(len) + "_" + Date.now()

// console.log(generatePassword())
module.exports = {
  createRandomPassword,
  createRandomEmail
}