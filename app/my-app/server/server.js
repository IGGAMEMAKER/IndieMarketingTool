const {app} = require('./expressGenerator')(3000);
// const {ok, fail} = require('./DB/Response')
const {UserModel, ProjectModel} = require('./Models')
// const mongoose = require('mongoose')

// var ObjectId = require('mongodb').ObjectId
var ObjectId = require('mongoose').Types.ObjectId;

// var u = new UserModel({email: '23i03g@mail.ru'})
//
// u.save().then(r => console.log({r})).catch(e => console.error({e}))

// var project = new ProjectModel({
//   name: 'Indie Marketing Tool',
//   type: 1, // 1 - app, 2 - game
//   ownerId: new ObjectId("6495f2aad151580c1f4b516a"), // mongoose.objectId("6495f2aad151580c1f4b516a"),
//
//   audiences: [
//     {
//       name: "Veteran gamedevs",
//       description: "Already wasted years and dont want repetition",
//       strategy: "DM low review game devs on Steam \nPostmortems",
//     },
//     // {
//     //   name: "Veteran devs",
//     //   description: "Already wasted years and dont want repetition",
//     //   strategy: ["Search by Postmortem posts"],
//     //   price: 25
//     // },
//     {
//       name: "Newbie gamedevs",
//       description: "Think their game will be an exception",
//       strategy: "through influencers via marketing 101 tutorials",
//     },
//     // {
//     //   name: 'Newbie devs',
//     //   description: 'Think their game will be an exception',
//     //   strategy: ['through influencers via marketing 101 tutorials'],
//     //   price: 10
//     // },
//     {
//       name: 'Devs',
//       description: 'Sublime. Play with ideas and quit fast',
//       strategy: "through blogs",
//     },
//   ],
//
//   monetizationPlans: [
//     {name: 'Demo', benefits: ['1 Full project?', "10 Free projects (basic functions)"], audiences: [2], price: 0},
//     {name: 'Basic', benefits: ['10 Projects', 'additional features?'], audiences: [1], price: 10},
//     {name: 'Pro', benefits: ['∞ Projects', 'even more features?'], audiences: [0], price: 25},
//     // {name: 'Enterprise',   description: '100 Projects + even more features?', audiences: []},
//   ],
//
//   channels: [
//     {name: 'SoloMyth', users: 2000, link: 'https://www.youtube.com/watch?v=YaUdstkv1RE'},
//     {name: 'Songs', users: 100, link: 'https://www.youtube.com/watch?v=qErChNhYAN8'},
//     {
//       name: 'gamedev',
//       users: 10000,
//       link: 'https://www.reddit.com/r/gamedev/comments/n4nvfa/project_management_tool/'
//     },
//     {name: 'Similar product', users: 400, link: 'https://www.reddit.com/user/bohlenlabs/'}
//   ],
//
//   risks: [
//     {
//       name: "Won't be interested enough",
//     },
//     {
//       name: "Won't understand",
//     },
//     {
//       name: "Won't buy it"
//     },
//     {
//       name: "Won't like it"
//     },
//     {
//       name: "Won't recommend it"
//     },
//   ]
// })
//
// project.save().then(r => console.log({r})).catch(e => console.error({e}))

const renderSPA = (req, res) => {
  var appPath = __dirname.replace('server', 'build') + '/index.html'
  res.sendFile(appPath);
}

const getUserInfoMiddleware = (req, res, next) => {
  req.userId = '6495f2aad151580c1f4b516a'

  next()
}

const createUser = async (req, res) => {}
const getProfile = async (req, res) => {
  ProjectModel.find({ownerId: new ObjectId(req.userId)})
    .then(projects => {
      res.json({
        projects
      })
    })
    .catch(err => {
      console.error({err})
      res.json({
        projects: [],
        fail: true
      })
    })
}
const createProject = async (req, res) => {
  var {
    appType,
    name
  } = req.body;

  var isGame = appType === 2;
  var risks = []
  if (isGame) {
    risks = [
      {name: "Won't be interested"},
      {name: "Won't understand"},
      {name: "Won't get enough numbers (wishlists, community)"},
      {name: "Dev will take too much time", solutions: ['MAKE SMALL GAME', 'SMALLER', 'TINY']},
      {name: "Won't buy it"},
      {name: "Won't like it"},
      {name: "Won't recommend it"},
    ]
  } else {
    risks = [
      {name: "Won't be interested enough"},
      {name: "Won't understand"},
      {name: "Won't buy it"},
      {name: "Won't like it"},
      {name: "Won't recommend it"},
    ]
  }

  var project = new ProjectModel({
  name: name,
  type: appType, // 1 - app, 2 - game
  ownerId: new ObjectId("6495f2aad151580c1f4b516a"), // mongoose.objectId("6495f2aad151580c1f4b516a"),

  audiences: [],
  monetizationPlans: [],
  channels: [],
  risks
})

project.save()
  .then(r => {
    console.log({r})
    res.json({objectId: '??'})
  })
  .catch(e => {
    console.error({e})
    res.json({fail: true})
  })
}
const getProject = async (req, res) => {
  var objectId = req.params.objectId;

  var p = await ProjectModel.findById(objectId)
  res.json({
    project: p,
  })
}
const updateProject = async (req, res) => {
  var objectId = req.params.objectId;
  var p = req.body.project;
  console.log({objectId}, p)

  var result = await ProjectModel.findByIdAndUpdate(objectId, p)

  console.log({result})

  res.json({
    result
  })
}

// ROUTES
app.get('/', renderSPA)
app.get('/projects/:objectId', renderSPA)
app.get('/profile', renderSPA) // show user projects here
app.get('/examples', renderSPA)
app.get('/pricing', renderSPA)

// ---------------- API ------------------------
app.post('/api/user', createUser)

app.get ('/api/profile', getUserInfoMiddleware, getProfile)
app.post('/api/projects', getUserInfoMiddleware, createProject)

app.get('/api/projects/:objectId', getProject)
app.put('/api/projects/:objectId', updateProject) // save changes
