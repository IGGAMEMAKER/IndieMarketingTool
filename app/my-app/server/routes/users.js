// TODO duplicate in routes/errorHandlers.js
const AUTHENTICATION_FAILED_ERROR = 'AUTHENTICATION_FAILED_ERROR'

const {MY_MAIL} = require("../../CD/Configs");
const {sendVerificationSuccess, sendResetPasswordEmail, sendVerificationEmail} = require("../mailer");

const {isDevIP} = require("./isAdminMiddleware");
const {createRandomPassword} = require("../createPassword");
const {sha} = require("../security");

const {UserModel} = require('../Models')


const createSessionToken = (email) => {
  return sha(email + Date.now())
}

const HASH = password => sha(password)
const createVerificationLink = () => {
  return HASH(createRandomPassword(35))
}

const getCookies = async req => {
  if (isDevIP(req)) {
    var u = await UserModel.findOne({email: MY_MAIL});

    return {
      email: MY_MAIL,
      sessionToken: u.sessionToken
    }
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
const flushCookies = (res, req) => {
  setCookies(res,'', '')
}
const setCookies = (res, token, email) => {
  res.cookie('sessionToken', token)
  res.cookie('email', email)
}
const printCookies = async (req, res) => {
  var {email, sessionToken} = await getCookies(req)

  console.log('printCookies', email, sessionToken)
}



const getUserId = user => user._id.toString()




const logout = (req, res, next) => {
  flushCookies(res, req)

  // TODO remove sessionToken on server
  res.redirect('/')
}

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

const authenticate = async (req, res, next) => {
  console.log('\nauthenticate')
  var {email, sessionToken} = await getCookies(req)
  await printCookies(req, res)

  var match = {
    email,
    sessionToken
  }

  UserModel.findOne(match)
    .then(user => {
      if (user) {
        // if (!user.verifiedAt) {
        //   sendVerificationEmail(email, createVerificationLink())
        //   res.redirect('/verify')
        // } else {
        // VERIFIED USER, WELCOME
        console.log({user})

        req.userId = getUserId(user)
        next()
        // }
      } else {
        console.log('user not found', match, req.cookies)

        req.userId = ''
        next(AUTHENTICATION_FAILED_ERROR)
      }
    })
    .catch(err => {
      console.error('CANNOT AUTHENTICATE', err)

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
      flushCookies(res, req)

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

    await flushCookies(res, req)
    res.redirect('/login?verificationFailed=1')
  } catch (err) {
    console.log('cannot verifyNewUser ERROR', {err})
    await flushCookies(res, req)
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
  authenticate,
  logIn,
  logout,

  verifyNewUser,
  createUser,
  resetPassword,
}