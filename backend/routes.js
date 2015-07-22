"use strict";

var express = require('express');
var app = express();
var bodyParser = require('body-parser'); //bodyparser + json + urlencoder
var morgan  = require('morgan'); // logger

app.listen(8001);
app.use(bodyParser());
app.use(morgan());

//Routes
var routes = {};
routes.users = require('./user');

app.all('*', function(req, res, next) {
  res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.set('Access-Control-Allow-Credentials', true);
  res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if ('OPTIONS' == req.method)
      return res.send(200);
  next();
});

app.post('/user/register', routes.users.register); 

app.post('/user/login', routes.users.login); 

app.post('/user/logout', routes.users.logout);

console.log('Intranet API is starting on port 8001');