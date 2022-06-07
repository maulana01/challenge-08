/** @format */

const express = require('express');
const app = express();
const swaggerJSON = require('./swagger.json');
const swaggerUI = require('swagger-ui-express');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const originalSend = app.response.send;
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
require('./passport-config');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use('/videos', express.static('videos'));
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerJSON));

app.response.send = function sendOverWrite(body) {
  originalSend.call(this, body);
  this.resBody = body;
};

morgan.token('res-body', (_req, res) => {
  // console.log(res.getHeader('Content-Type'));
  if (res.getHeader('Content-Type') === 'application/json; charset=utf-8') {
    return JSON.stringify(res.resBody);
  } else {
    return null;
  }
});

app.use(
  morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :res-body', {
    stream: accessLogStream,
  })
);

app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const router = require('./router');
app.use(router);

module.exports = app;
