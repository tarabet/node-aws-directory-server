require('dotenv').config(); // Sets up dotenv as soon as our application starts

const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

const environment = process.env.NODE_ENV; // development
const prodFrontUrl = process.env.PROD_FRONTEND_URL
const devFrontUrl = process.env.DEV_FRONTEND_URL

const stage = require('./config')[environment];

const routes = require('./routes/index.js')

const isProd = environment === "production"

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

if (!isProd) {
  app.use(logger('dev'));
}

// Add headers
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  // res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader('Access-Control-Allow-Origin', isProd ? prodFrontUrl : devFrontUrl);

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use('/api/v1', routes(router));

app.listen(`${stage.port}`, () => {
  console.log(`Server now listening at localhost:${stage.port}`);
});

module.exports = app;
