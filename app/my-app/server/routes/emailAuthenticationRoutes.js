const {MY_MAIL} = require("../../CD/Configs");
const {sendResetPasswordEmail} = require("../mailer");
const {flushCookies} = require("./cookieHelpers");
const {sendVerificationSuccess} = require("../mailer");
const {generateCookies} = require("./cookieHelpers");
const {UserModel} = require("../Models");
const {isDevIP} = require("./isAdminMiddleware");
const {printCookies} = require("./cookieHelpers");
const {sha} = require("../security");
const {createRandomPassword} = require("../createPassword");

// TODO duplicate in routes/errorHandlers.js
const AUTHENTICATION_FAILED_ERROR = 'AUTHENTICATION_FAILED_ERROR'

const HASH = password => sha(password)
const createVerificationLink = () => {
  return HASH(createRandomPassword(35))
}

// const authenticate = async (req, res, next) => {
//   console.log('\nauthenticate')
//   var {email, sessionToken} = await getCookies(req)
//   await printCookies(req, res)
//
//   var match = {
//     email,
//     sessionToken
//   }
//
//   UserModel.findOne(match)
//     .then(user => {
//       if (user) {
//         // if (!user.verifiedAt) {
//         //   sendVerificationEmail(email, createVerificationLink())
//         //   res.redirect('/verify')
//         // } else {
//         // VERIFIED USER, WELCOME
//         console.log({user})
//
//         req.userId = getUserId(user)
//         next()
//         // }
//       } else {
//         console.log('user not found', match, req.cookies)
//
//         req.userId = ''
//         next(AUTHENTICATION_FAILED_ERROR)
//       }
//     })
//     .catch(err => {
//       console.error('CANNOT AUTHENTICATE', err)
//
//       next(AUTHENTICATION_FAILED_ERROR)
//     })
// }


// TODO these are outdated?
const logIn = async (req, res, next) => {
  var {email, password} = req.body;

  console.log('LOG IN', {email, password})
  await printCookies(req, res)

  var matchObject = {
    email,
    password: HASH(password)
  }

  if (isDevIP(req)) {
    matchObject = {
      email: MY_MAIL
    }
  }

  UserModel.findOne(matchObject)
    .then(async user => {
      if (user) {
        console.log('logIn', {user})
        // if has OK cookies, maybe send existing ones?
        await printCookies(req, res)
        await generateCookies(res, email, req)

        res.json({ok: 1})
      } else {
        next(AUTHENTICATION_FAILED_ERROR)
      }
    })
    .catch(err => {
      console.error('ERROR IN logIn', {err})
      next(AUTHENTICATION_FAILED_ERROR)
    })
}

const createUser = async (req, res) => {
  var {email, password} = req.body;

  var verificationLink = createVerificationLink()
  var u = new UserModel({
    email,
    password: HASH(password),
    verificationLink
  })

  u.save()
    .then(async r => {
      console.log({r})
      sendVerificationSuccess(email)
      await generateCookies(res, email, req)

      // no redirect?
      res.redirect('/profile')
      // await generateCookies(res, email, req)
      //
      // sendVerificationEmail(email, verificationLink)
      //
      // res.redirect('/profile')
    })
    .catch(e => {
      console.error({e})
      flushCookies(res)

      res.redirect('/register?userExists=1')
    })
}


// TODO remove after login with socials
const verifyNewUser = async (req, res) => {
  var {user, link} = req.query;
  var email = user;
  var verificationLink = link;
  console.log(req.query, req.url, req.pathname)

  try {
    var r = await UserModel.updateOne({email, verificationLink}, {verifiedAt: new Date()})
    console.log('VERIFICATION RESULT', {email, verificationLink}, {r})

    if (r.modifiedCount) {
      // USER VERIFIED
      sendVerificationSuccess(email)
      await generateCookies(res, email, req)

      // no redirect?
      res.redirect('/profile')
      return
    }

    await flushCookies(res)
    res.redirect('/login?verificationFailed=1')
  } catch (err) {
    console.log('cannot verifyNewUser ERROR', {err})
    await flushCookies(res)
    res.redirect('/login?verificationFailed=2')
  }
}

// TODO remove after login with socials
const resetPassword = async (req, res) => {
  var {email} = req.body
  var newPassword = createRandomPassword(20);

  console.log({newPassword})

  UserModel.updateOne({email}, {password: HASH(newPassword)})
    .then(r => {
      console.log({r})
      sendResetPasswordEmail(email, newPassword)
      console.log('sent reset password email')
      // TODO SEND VERIFICATION EMAIL
    })
    .catch(err => {
      console.log('cannot reset password', {err})
    })
    .finally(() => {
      res.redirect('/login?resetPassword=1')
    })
}

module.exports = {
  logIn,
  createUser,
  verifyNewUser,
  resetPassword
}