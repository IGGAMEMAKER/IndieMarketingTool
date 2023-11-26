const {createRandomEmail} = require("../createPassword");
const {ObjectId} = require("../Models");
const {resetPassword, verifyNewUser, createUser} = require("./emailAuthenticationRoutes");

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

const authAsGuest = async (req, res) => {
  var u = new UserModel({email: createRandomEmail(20), isGuest: true })
  var user = await u.save()

  setGuestUserIdCookie(res, getUserId(user))

  redirect(res, '/profile', false)
}

const convertGuestToNormalUser = async (req, res) => {
  // var userId
  // var email
  // isGuest = false;
  //
  // UserModel.updateOne({_id: new ObjectId(userId)}, {isGuest: false, email})
}


const authenticate = async (req, res, next) => {
  console.log('\nauthenticate')
  var {email, sessionToken, userId} = await getCookies(req)
  await printCookies(req, res)

  var query = {
    email,
    sessionToken
  }

  console.log('check isDevIP')
  if (isDevIP(req)) {
    query = {
      email: MY_MAIL
    }
  }

  if (userId) {
    query = {
      _id: new ObjectId(userId)
    }
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


const authGoogleUser = async (req, res) => {
  var {response} = req.body;

  var credential = jwtDecode(response.credential)
  console.log('credential', credential)

  var email = credential.email;

  let user = await UserModel.findOne({email})
  if (!user) {
    var u = new UserModel({email})
    await u.save()
  }

  await generateCookies(res, email, req)
  redirect(res, '/profile', false)
}



module.exports = {
  authGoogleUser,

  authenticate,
  logout,

  // login as guest
  authAsGuest,
  convertGuestToNormalUser,

  // // TODO remove log in with email
  // logIn,
  // createUser,
  // verifyNewUser,
  // resetPassword,
}