const errorHandler = (err, req, res, next) => {
  console.error(err, req.url);

  res.status(500);
  res.json({ error: err });
}

const logParams = db => (title) => async (req, res, next) => {
  db.print(`${title}: ` + JSON.stringify(req.params));

  next();
}

const proxyToDB = db => async (req, res) => {
  const isPost = req.method === "POST";
  const isGet = !isPost; // req.method === "GET";

  if (isPost) {
    db.post(req.url, req.body)
      .then(r => {
        res.json(r)
      })
      .catch(err => {
        res.json({
          err
        })
      })
  }

  if (isGet) {
    db.get(req.url)
      .then(r => {
        res.json(r)
      })
      .catch(err => {
        res.json({
          err
        })
      })
  }
}

const createApp = port => {
  const express = require('express');
  const cors = require("cors");

  const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  }

  const {ip} = require("./Configs/myHost");

  const host = ip + ':' + port;
  const db = require("./db")(host);


  const app = express();
  app.use('/static', express.static(__dirname + '/output'));
  app.use(cors(corsOptions))
  app.use(errorHandler)

// http://expressjs.com/en/resources/middleware/body-parser.html
// https://stackoverflow.com/questions/19917401/error-request-entity-too-large
  const limit = '100mb'
  app.use(express.json({limit}));
  app.use(express.urlencoded({ extended: true, limit }));
//app.use(express.urlencoded({limit: '50mb'}));

  app.listen(port);
  const startMeasuring = (req, res, next) => {
    req.t0 = Date.now();
    // console.log(req.method, req.url);
    next();
  }

  app.use(startMeasuring);

  return {
    app,
    db,
    host,

    logParams: logParams(db),
    proxyToDB: proxyToDB(db),

    push: message => db.push(message),
  };
}

module.exports = createApp;