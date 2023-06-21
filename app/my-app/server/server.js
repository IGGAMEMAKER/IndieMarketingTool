const {app, host, db} = require('./expressGenerator')(3000);
// const {ok, fail} = require('./DB/Response')

// -------- STRUCTURE --------

app.get('/', (req, res) => {
  var appPath = __dirname + '/build/static/index.html'
  console.log(__dirname, appPath)
  // res.json({
  //   ok: 1,
  //   text: 'you are on main page'
  // })
  res.sendFile(appPath);
})

