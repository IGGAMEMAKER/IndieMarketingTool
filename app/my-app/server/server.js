const {ProjectModel} = require("./Models");
const {MY_MAIL} = require("../CD/Configs");
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

const createSessionToken = (email) => {
  return sha(email + Date.now())
}

const HASH = password => sha(password)
const createVerificationLink = () => {
  return HASH(createRandomPassword(35))
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

let devIP;
const getIP = (req) => {
  const ipAddresses = req.header('x-forwarded-for');
  return ipAddresses
}
const isDevIP = (req) => {
  return getIP(req) === devIP
  // return !!req.cookies["isDevIP"]
}

const isAdminMiddleware = (req, res, next) => {
  if (isDevIP(req)) {
    next()
  } else {
    next('access restricted')
  }
}

const saveDevIP = (req, res) => {
  const ipAddresses = getIP(req);
  console.log({ipAddresses})
  devIP = ipAddresses

  // res.cookie('isDevIP', true)

  res.json({
    cookieSet: true,
    ipAddresses
  })
}

const flushDevIP = (req, res) => {
  devIP = ''
  // res.cookie('isDevIP', false)

  res.json({
    cookieFlushed: true
  })
}


const logIn = async (req, res, next) => {
  console.log('LOG IN')

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

        res.json({
          ok: 1
        })
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
        if (!user.verifiedAt) {
          sendVerificationEmail(email, createVerificationLink())
          res.redirect('/verify')
        } else {
          // VERIFIED USER, WELCOME
          console.log({user})

          req.userId = getUserId(user)
          next()
        }
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

  var verificationLink = createVerificationLink()
  var u = new UserModel({
    email,
    password: HASH(password),
    verificationLink
  })

  u.save()
    .then(async r => {
      console.log({r})
      await generateCookies(res, email, req)
      sendVerificationEmail(email, verificationLink)

      res.redirect('/profile')
    })
    .catch(e => {
      console.error({e})
      flushCookies(res, req)

      res.redirect('/register?userExists=1')
    })
}

const getProjects = async (req, res) => {
  var result = await ProjectModel.find({});
  var grouped = await ProjectModel.aggregate([
    {
      $match: {
        name: {$exists: true}
      }
    },
    {
      $group: {
        _id: '$ownerId',
        count: { $sum: 1 },
        // projects: {$push: {item: "$name"}}
        projects: {$push: "$$ROOT"}
        // itemsSold: { $push: { item: "$item" } }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'lulul'
      }
    }
  ])

  res.json({
    result,
    grouped
  })
}

// ROUTES
app.get('/', renderSPA)
app.get('/projects/:objectId', authenticate, renderSPA)
app.get('/profile', authenticate, renderSPA) // show user projects here
app.get('/examples', renderSPA)
app.get('/pricing', renderSPA)

app.get('/admin', isAdminMiddleware, renderSPA)

app.get('/register', renderSPA)
app.get('/login', renderSPA)
app.get('/verify', renderSPA)
app.get('/reset', renderSPA)
app.get('/logout', logout, renderSPA)
app.get('/authenticated', authenticate, (req, res) => res.json({authenticated: !!req.userId}))


// ---------------- API ------------------------
app.post  ('/api/login', logIn)
app.post  ('/api/user', createUser)
app.post  ('/api/reset-password', resetPassword)
app.get   ('/api/users/verify', verifyNewUser)

app.get('/api/me/login', saveDevIP)
app.get('/api/me/logout', flushDevIP)

app.get('/api/projects', isAdminMiddleware, getProjects)

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

app.get   ('/api/projects/:objectId', /*authenticate,*/ getProject) // TODO visibility settings
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