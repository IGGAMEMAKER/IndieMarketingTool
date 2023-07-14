const {sendVerificationSuccess} = require("./mailer");
const {createRandomPassword} = require("./createPassword");
const {sendResetPasswordEmail, sendVerificationEmail} = require("./mailer");
const {app} = require('./expressGenerator')(3000);

const {getProject} = require("./routes/getProject");
const {updateProject} = require("./routes/updateProject");
const {removeProject} = require("./routes/removeProject");
const {getProfile} = require("./routes/getProfile");
const {createProject} = require("./routes/createProject");
const {getLinkName} = require("./routes/researchLinks");
const {sha} = require("./security");

const {UserModel} = require('./Models')

const renderSPA = (req, res) => {
  var appPath = __dirname.replace('server', 'build') + '/index.html'
  res.sendFile(appPath);
}

const AUTHENTICATION_FAILED_ERROR = 'AUTHENTICATION_FAILED_ERROR'



const getCookies = req => {
  return {
    email: req.cookies["email"],
    sessionToken: req.cookies["sessionToken"]
  }
}
const generateCookies = async (res, email) => {
  var token = createSessionToken(email)
  setCookies(res, token, email)

  await UserModel.updateOne({
    email
  }, {
    sessionToken: token,
    sessionCreatedAt: new Date()
  })
}
const flushCookies = (res) => {
  setCookies(res, '', '')
}
const setCookies = (res, token, email) => {
  res.cookie('sessionToken', token)
  res.cookie('email', email)
}

const createSessionToken = (email) => {
  return sha(email + Date.now())
}

const HASH = password => sha(password)

const logIn = (req, res, next) => {
  console.log('LOG IN')
  var {email, password} = req.body;
  console.log('LOG IN', {email, password})

  var matchObject = {
    email,
    password: HASH(password)
  }

  UserModel.findOne(matchObject)
    .then(async user => {
      if (user) {
        console.log('logIn', {user})
        await generateCookies(res, email)

        res.redirect('/profile')
      } else {
        next(AUTHENTICATION_FAILED_ERROR)
      }
    })
    .catch(err => {
      // next('ERROR IN AUTHENTICATE')
      console.error('ERROR IN logIn', {err})
      next(AUTHENTICATION_FAILED_ERROR)
      // res.redirect('/login')
    })
}

const logout = (req, res, next) => {
  flushCookies(res)
  res.redirect('/')
}
const authenticate = (req, res, next) => {
  var {email, sessionToken} = getCookies(req)
  // check email & sessionToken
  // if they match => set userId && next()
  // otherwise => redirect to /Login

  console.log('authenticate')
  var match = {
    email,
    sessionToken
  }
  UserModel.findOne(match)
    .then(user => {
      if (user) {
        console.log({user})

        req.userId = user._id.toString() // '6495f2aad151580c1f4b516a'
        console.log(req.userId)
        next()
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

const verifyNewUser = async (req, res) => {
  var {email, verificationLink} = req.query;

  UserModel.updateOne({email, verificationLink}, {verifiedAt: new Date()})
    .then(r => {
      console.log('VERIFICATION RESULT', {email, verificationLink}, {r})
      sendVerificationSuccess(email)
    })
    .catch(err => {
      console.log('cannot reset password', {err})
    })
    .finally(() => {
      res.redirect('/login?resetPassword=1')
    })
}

const resetPassword = async (req, res) => {
  var {email} = req.body
  var newPassword = createRandomPassword(20);

  console.log({
    newPassword
  })

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

const createUser = async (req, res) => {
  var {email, password} = req.body;

  var verificationLink = HASH(createRandomPassword(35))
  var u = new UserModel({
    email,
    password: HASH(password),
    verificationLink
  })

  u.save()
    .then(async r => {
      console.log({r})
      await generateCookies(res, email)
      // setCookies(res, sessionToken, email)
      sendVerificationEmail(email, verificationLink)

      res.redirect('/profile')
    })
    .catch(e => {
      console.error({e})
      flushCookies(res)

      res.redirect('/register?userExists=1')
    })
}

// ROUTES
app.get('/', renderSPA)
app.get('/projects/:objectId', authenticate, renderSPA)
app.get('/profile', authenticate, renderSPA) // show user projects here
app.get('/examples', renderSPA)
app.get('/pricing', renderSPA)

app.get('/register', renderSPA)
app.get('/login', renderSPA)
app.get('/reset', renderSPA)
app.get('/logout', logout, renderSPA)
app.get('/authenticated', authenticate, (req, res) => res.json({authenticated: !!req.userId}))


// ---------------- API ------------------------
app.post  ('/api/login', logIn)
app.post  ('/api/user', createUser)
app.post  ('/api/reset-password', resetPassword)
app.get   ('/api/users/verify', verifyNewUser)

app.get   ('/test/cookies/:str', (req, res) => {
  res.cookie("Cookieee", req.params.str)
  res.json({ok: 1})
})
app.get   ('/test/cookies', (req, res) => {
  var v = req.cookies["Cookieee"]
  console.log({v})
  res.json({ok: 1, v, cookies: req.cookies})
})


// app.get   ('/api/passwords', (req, res) => res.json({pass: 'WWWWW'}))
app.get   ('/api/profile',            authenticate, getProfile)
app.post  ('/api/projects',           authenticate, createProject)

app.get   ('/api/projects/:objectId', authenticate, getProject)
app.put   ('/api/projects/:objectId', authenticate, updateProject) // save changes
app.delete('/api/projects/:objectId', authenticate, removeProject)

// TODO protect that link with password too?
app.post('/links/name', getLinkName)

const customErrorHandler = (err, req, res, next) => {
  console.error('custom error handler', req.url, req.method)
  if (err) {
    console.log(err, {err})
  }

  if (err === AUTHENTICATION_FAILED_ERROR) {
    res.redirect('/login')
    return
  }

  next(err)
}
const standardErrorHandler = (err, req, res, next) => {
  console.error(err, req.url);

  res.status(500);
  res.json({ error: err });
}

app.use(customErrorHandler)
app.use(standardErrorHandler)