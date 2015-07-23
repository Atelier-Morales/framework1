"use strict";

var express = require('express');
var app = express();
var bodyParser = require('body-parser'); //bodyparser + json + urlencoder
var morgan  = require('morgan'); // logger
var fs = require('fs');
var http = require('http');
var https = require('https');

var privateKey  = fs.readFileSync('/etc/nginx/ssl/nginx.key', 'utf8');
var certificate = fs.readFileSync('/etc/nginx/ssl/nginx.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app).listen(8001);
var httpsServer = https.createServer(credentials, app).listen(8002);

app.use(bodyParser());
app.use(morgan());

//Routes
var routes = {};
routes.users = require('./user');

app.all('*', function(req, res, next) {
    if (req.protocol === "https")
        res.set('Access-Control-Allow-Origin', 'https://localhost');
    else
        res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    if ('OPTIONS' == req.method)
        return res.send(200);
    next();
});

app.post('/user/register', routes.users.register);

app.post('/user/verifyToken', routes.users.verifyToken); 

app.post('/user/login', routes.users.login); 

app.post('/user/logout', routes.users.logout);

console.log('Intranet API is starting on port 8001');