const {app} = require('./expressGenerator')(3000);
// const {ok, fail} = require('./DB/Response')

app.get('/', (req, res) => {
  var appPath = __dirname.replace('server', 'build') + '/index.html'
  res.sendFile(appPath);
})

const createUser = async (req, res) => {}
const createProject = async (req, res) => {}

app.post('/user', createUser)
app.post('/project', createProject)

// app.get('/projects')

// save changes
// app.post('/')
app.get('/test', (req, res) => res.json({tested: 1}))
