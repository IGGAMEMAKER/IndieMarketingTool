const {ProjectModel} = require("../Models");
const {createRandomEmail} = require("../createPassword");
const {ObjectId} = require("../Models");

// TODO duplicate in routes/errorHandlers.js
const AUTHENTICATION_FAILED_ERROR = 'AUTHENTICATION_FAILED_ERROR'

const {generateCookies, getCookies, flushCookies, printCookies, setGuestUserIdCookie} = require("./cookieHelpers");
const {redirect} = require("./redirect");

const {MY_MAIL} = require("../../CD/Configs");

const {jwtDecode} = require("jwt-decode")
const {isDevIP} = require("./isAdminMiddleware");

const {UserModel} = require('../Models')





const getUserId = user => user._id.toString()

const logout = (req, res, next) => {
  flushCookies(res)

  // TODO remove sessionToken on server
  res.redirect('/')
}


const authenticate = async (req, res, next) => {
  console.log('\nauthenticate')

  await printCookies(req, res)

  var query;
  var {email, sessionToken, userId} = await getCookies(req)

  if (isDevIP(req)) {
    // used for localhost
    query = {email: MY_MAIL}
  } else if (userId) {
    query = {_id: new ObjectId(userId)}
    req.isGuest = true
  } else {
    query = {email, sessionToken}
  }

  UserModel.findOne(query)
    .then(user => {
      if (user) {
        console.log({user})

        req.userId = getUserId(user)
        next()
      } else {
        console.log('user not found', query, req.cookies)

        req.userId = ''
        next(AUTHENTICATION_FAILED_ERROR)
      }
    })
    .catch(err => {
      console.error('CANNOT AUTHENTICATE', err)
      flushCookies(res)

      next(AUTHENTICATION_FAILED_ERROR)
    })
}

const createGuestAccount = async (req, res) => {
  var u = new UserModel({email: createRandomEmail(20), isGuest: true })
  var user = await u.save()

  setGuestUserIdCookie(res, getUserId(user))
}
const authAsGuest = async (req, res) => {
  await createGuestAccount(req, res)
  // var u = new UserModel({email: createRandomEmail(20), isGuest: true })
  // var user = await u.save()
  //
  // setGuestUserIdCookie(res, getUserId(user))

  redirect(res, '/profile', false)
}

const createGuestAccountIfHasNoCookies = async (req, res, next) => {
  var {email, sessionToken, userId} = await getCookies(req)

  var hasUserInfo = userId || (email && sessionToken)
  if (!hasUserInfo)
    await createGuestAccount(req, res)

  next();
}

const convertGuestToNormalUser = async (req, res) => {
  var {userId} = await getCookies(req)

  if (userId) {
    var newEmail = getEmailFromGoogleRequest(req)
    console.log('got new mail for guest', newEmail)

    // var u = await UserModel.findOne({_id: new ObjectId(userId)})
    var u = await UserModel.findOne({email: newEmail})

    if (u) {
      // email registered, so merge accounts

      // transfer projects
      await ProjectModel.updateMany({ownerId: userId}, {ownerId: getUserId(u) })

      flushCookies(res)

      // remove guest account
      await UserModel.findByIdAndRemove(userId)
    } else {
      // just assign an email
      await UserModel.updateOne(
        {_id: new ObjectId(userId)},
        {email: newEmail, isGuest: false}
      )
    }

    await generateCookies(res, newEmail)
    redirect(res, '/profile', false)

    // await UserModel.updateOne({_id: new ObjectId(userId)}, {isGuest: false, email})
  }

  // 1) guest + new email = attach email normally
  // 2) guest + existing email: merge accounts?

  // remove userId from cookies

  // var userId
  // var email
  // isGuest = false;
  //
  // UserModel.updateOne({_id: new ObjectId(userId)}, {isGuest: false, email})
}

const getEmailFromGoogleRequest = (req, res) => {
  var {response} = req.body;

  var credential = jwtDecode(response.credential)
  console.log('credential', credential)

  var email = credential.email;

  return email;
}

const authGoogleUser = async (req, res) => {
  // var {response} = req.body;
  //
  // var credential = jwtDecode(response.credential)
  // console.log('credential', credential)
  //
  // var email = credential.email;
  var email = getEmailFromGoogleRequest(req)

  let user = await UserModel.findOne({email})
  if (!user) {
    var u = new UserModel({email})
    await u.save()
  }

  await generateCookies(res, email)
  redirect(res, '/profile', false)
}



module.exports = {
  authGoogleUser,

  authenticate,
  logout,

  // login as guest
  authAsGuest,
  createGuestAccount,
  createGuestAccountIfHasNoCookies,
  convertGuestToNormalUser
}