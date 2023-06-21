const {app, host, db} = require('./expressGenerator')(3000);
// const {ok, fail} = require('./DB/Response')

// -------- STRUCTURE --------

app.get('/', (req, res) => {
  console.log(__dirname)
  res.json({
    ok: 1,
    text: 'you are on main page'
  })
  res.sendFile(__dirname + '/Index.html');
})

