const {MY_MAIL} = require("../../CD/Configs");
const {UserModel} = require("../Models");
const {isDevIP} = require("./isAdminMiddleware");
const {sha} = require("../security");

const createSessionToken = (email) => {
  return sha(email + Date.now())
}

const flushCookies = (res) => {
  setCookies(res,'', '')
  setGuestUserIdCookie(res, '')
}

const setGuestUserIdCookie = (res, userId) => {
  res.cookie('userId', userId)
}
const setCookies = (res, token, email) => {
  res.cookie('sessionToken', token)
  res.cookie('email', email)
}
const printCookies = async (req, res) => {
  var {email, sessionToken, userId} = await getCookies(req)

  if (userId) {
    console.log('cookies of guest #' + userId)
  } else {
    console.log('printCookies', email, sessionToken)
  }
}

const getCookies = async req => {
  if (isDevIP(req)) {
    var u = await UserModel.findOne({email: MY_MAIL});

    return {
      email: MY_MAIL,
      sessionToken: u.sessionToken
    }
  }

  if (req.cookies["userId"]) {
    return Promise.resolve({
      userId: req.cookies["userId"]
    })
  }

  return Promise.resolve({
    email: req.cookies["email"],
    sessionToken: req.cookies["sessionToken"]
  })
}

const generateCookies = async (res, email, req) => {
  var token

  var u = await UserModel.findOne({email});
  if (!u)
    return

  var expired = false
  if (!u?.sessionToken || expired) {
    // no token or expired token => create new
    token = createSessionToken(email)

    var r = await UserModel.updateOne({
      email,
      // sessionToken: {$exists: false}
    }, {
      sessionToken: token,
      sessionCreatedAt: new Date()
    })
  } else {
    // has active token already
    token = u.sessionToken
  }

  setCookies(res, token, email)
}


module.exports = {
  printCookies,
  flushCookies,

  generateCookies,
  setGuestUserIdCookie,

  getCookies
}