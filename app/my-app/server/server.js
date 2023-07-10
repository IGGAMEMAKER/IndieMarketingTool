const {getProject} = require("./routes/getProject");
const {app} = require('./expressGenerator')(3000);

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
const customErrorHandler = (err, req, res, next) => {
  console.error('custom error handler')
  if (err) {
    console.log(err, {err})
  }


  // if auth err
  res.redirect('/login')
}
const standardErrorHandler = (err, req, res, next) => {
  console.error(err, req.url);

  res.status(500);
  res.json({ error: err });
}
app.use(customErrorHandler)
app.use(standardErrorHandler)


const getCookies = req => {
  return {
    email: req.cookies["email"],
    sessionToken: req.cookies["sessionToken"]
  }
}
const generateCookies = (res, email) => {
  setCookies(res, createSessionToken(email), email)
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

  UserModel.findOne({
    email,
    password: HASH(password)
  })
    .then(user => {
      if (user) {
        console.log('logIn', {
          user
        })
        generateCookies(res, email)
        res.redirect('/profile')
      } else {
        next(AUTHENTICATION_FAILED_ERROR)
        // res.redirect('/login')
      }
    })
    .catch(err => {
      // next('ERROR IN AUTHENTICATE')
      console.error('ERROR IN logIn', {err})
      next(AUTHENTICATION_FAILED_ERROR)
      // res.redirect('/login')
    })
}


const authenticate = (req, res, next) => {
  var {email, sessionToken} = getCookies(req)
  // check email & sessionToken
  // if they match => set userId && next()
  // otherwise => redirect to /Login

  UserModel.findOne({
    email,
    sessionToken
  })
    .then(user => {
      if (user) {
        console.log('authenticate', user)

        req.userId = '6495f2aad151580c1f4b516a'
        next()
      } else {
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
  var {email, password} = req.body.email;

  var sessionToken = createSessionToken(email)

  var u = new UserModel({
    email,
    password: HASH(password),
    sessionToken,
    sessionCreatedAt: new Date()
  })

  u.save()
    .then(r => {
      console.log({r})
      setCookies(res, sessionToken, email)

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


// ---------------- API ------------------------
app.post  ('/api/login', logIn)
app.post  ('/api/user', createUser)

app.get('/test/cookies/:str', (req, res) => {
  res.cookie("Cookieee", req.params.str)
  res.json({ok: 1})
})

app.get('/test/cookies', (req, res) => {
  var v = req.cookies["Cookieee"]
  console.log({v})
  res.json({ok: 1, v, cookies: req.cookies})
})



app.get   ('/api/profile',            authenticate, getProfile)
app.post  ('/api/projects',           authenticate, createProject)

app.get   ('/api/projects/:objectId', authenticate, getProject)
app.put   ('/api/projects/:objectId', authenticate, updateProject) // save changes
app.delete('/api/projects/:objectId', authenticate, removeProject)

// TODO protect that link with password too?
app.post('/links/name', getLinkName)
