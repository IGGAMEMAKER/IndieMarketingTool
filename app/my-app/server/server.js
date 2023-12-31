// const {PORTS} = require("../CD/Configs/servers");
// const {app} = require('./expressGenerator')(PORTS.PORT_DB);
const {createGuestAccountIfHasNoCookies} = require("./routes/users");
const {createGuestAccount} = require("./routes/users");
const {app} = require('./expressGenerator')(3000);

const {resetPassword, logIn, createUser} = require("./routes/emailAuthenticationRoutes");

const {authenticate, authAsGuest, authGoogleUser, convertGuestToNormalUser, logout} = require("./routes/users");
const {canUpdateProjectMiddleware} = require("./routes/updateProject");

// if fails to find modules
// npm cache clean -force
// rm package-lock.json
// rm -r node_modules
// npm i --save --legacy-peer-deps
// https://stackoverflow.com/questions/9023672/how-do-i-resolve-cannot-find-module-error-using-node-js

const {isAdminMiddleware, saveDevIP, flushDevIP} = require('./routes/isAdminMiddleware')

const {getUserProjects} = require("./routes/getUserProjects");
const {getProject} = require("./routes/getProject");
const {updateProject} = require("./routes/updateProject");
const {removeProject} = require("./routes/removeProject");
const {getProfile} = require("./routes/getProfile");
const {createProject} = require("./routes/createProject");
const {getLinkName} = require("./routes/researchLinks");
const {standardErrorHandler, customErrorHandler} = require("./routes/errorHandlers");
const {saveUserUnderstandingStatsRoute, saveUserActionRoute} = require("./routes/saveUserActions");


const renderSPA = (req, res) => {
  var appPath = __dirname.replace('server', 'build') + '/index.html'
  res.sendFile(appPath);
}


// --------------- ROUTES ------------------
app.get('/', renderSPA)
app.get('/examples', renderSPA)
app.get('/pricing', renderSPA)
app.get('/about', renderSPA)
app.get('/register', renderSPA)
app.get('/save-progress', renderSPA)
app.get('/login', renderSPA)
app.get('/verify', renderSPA)
app.get('/reset', renderSPA)


app.get('/create'/*,              createGuestAccountIfHasNoCookies*//*, async (req, res, next) => {
  await createGuestAccount(req, res);
  next()
}*/, renderSPA)
app.get('/projects/:objectId',  authenticate, renderSPA)
app.get('/profile',             authenticate, renderSPA) // show user projects here
app.get('/logout',              logout, renderSPA)

app.get('/admin/panel', isAdminMiddleware, renderSPA)

app.get('/authenticated',       authenticate, (req, res) => res.json({authenticated: !!req.userId, isGuest: !!req.isGuest}))

// ---------------- API ------------------------
app.post  ('/api/guest/auth', createGuestAccountIfHasNoCookies, (req, res) => res.json({ok: 1}))
app.post  ('/api/user/google', authGoogleUser)
app.post  ('/api/user/guest', authAsGuest)
app.post  ('/api/user/guest/auth', convertGuestToNormalUser)

app.post  ('/api/user', createUser) // todo remove
app.post  ('/api/login', logIn) // todo remove
app.post  ('/api/reset-password', resetPassword) // todo remove
// app.get   ('/api/users/verify', verifyNewUser) // todo remove

app.get('/api/me/login', saveDevIP)
app.get('/api/me/logout', flushDevIP)

app.get('/api/projects', isAdminMiddleware, getUserProjects)


app.get   ('/api/profile',            authenticate, getProfile)
app.post  ('/api/projects',           authenticate, createProject)

app.get   ('/api/projects/:objectId', /*authenticate,*/ getProject) // TODO visibility settings
app.put   ('/api/projects/:objectId', authenticate, canUpdateProjectMiddleware, updateProject) // save changes // TODO CHECK WHO CAN EDIT THE PROJECT
app.delete('/api/projects/:objectId', authenticate, removeProject)

app.post('/api/stats/actions', authenticate, saveUserActionRoute)
app.post('/api/stats/inputs', authenticate, saveUserUnderstandingStatsRoute)

// TODO protect that link with password too?
app.post('/links/name', getLinkName)

// TODO remove???
app.get   ('/test/cookies/:str', (req, res) => {
  res.cookie("Cookieee", req.params.str)
  res.json({ok: 1})
})
app.get   ('/test/cookies', (req, res) => {
  var v = req.cookies["Cookieee"]
  console.log({v})
  res.json({ok: 1, v, cookies: req.cookies})
})



app.use(customErrorHandler)
app.use(standardErrorHandler)