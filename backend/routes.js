"use strict";

var express = require('express');
var app = express();
var bodyParser = require('body-parser'); //bodyparser + json + urlencoder
var morgan  = require('morgan'); // logger
var fs = require('fs');
var http = require('http');
var https = require('https');

var privateKey  = fs.readFileSync('../nginx/ssl/nginx.key', 'utf8');
var certificate = fs.readFileSync('../nginx/ssl/nginx.crt', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app).listen(8001);
var httpsServer = https.createServer(credentials, app).listen(8002);

app.use(bodyParser());
app.use(morgan());

//Routes
var routes = {};
routes.users = require('./user');
routes.projects = require('./project');
routes.forum = require('./forum');
routes.tickets = require('./tickets');
routes.mailer = require('./mailer');

app.all('*', function(req, res, next) {
    if (req.protocol === "https")
        res.set('Access-Control-Allow-Origin', 'https://localhost:4443');
    else
        res.set('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.set('Access-Control-Allow-Credentials', true);
    res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    if ('OPTIONS' == req.method)
        return res.send(200);
    next();
});

// User functions

app.post('/user/verifyToken', routes.users.verifyToken);

app.post('/user/verifyTokenLDAP', routes.users.verifyTokenLDAP);

app.get('/user/fetchUsers', routes.users.fetchUsers);

app.post('/user/updateUser', routes.users.updateUser);

app.post('/user/removeUser', routes.users.removeUser);

app.post('/user/register', routes.users.register);

app.post('/user/registerProject', routes.users.registerProject);

app.post('/user/completeProject', routes.users.completeProject);

app.post('/user/login', routes.users.login); 

app.post('/user/loginLDAP', routes.users.loginLDAP);

app.post('/user/logout', routes.users.logout);

// Project functions

app.post('/project/fetchProjects', routes.projects.fetchProjects);

app.post('/project/createProject', routes.projects.createProject);

app.post('/project/deleteProject', routes.projects.deleteProject);

app.post('/project/updateProject', routes.projects.updateProject);

//forum functions

app.get('/forum/categories', routes.forum.fetchCategories);

app.get('/forum/threads', routes.forum.fetchThreads);

app.post('/forum/createCategory', routes.forum.createCategory);

app.post('/forum/createSubCategory', routes.forum.createSubCategory);

app.post('/forum/removeSubCategory', routes.forum.removeSubCategory);

app.post('/forum/createThread', routes.forum.createThread);

app.post('/forum/postCommentBody', routes.forum.postCommentBody);

app.post('/forum/postReply', routes.forum.postReply);

app.post('/forum/postReplyComment', routes.forum.postReplyComment);

//ticket functions

app.post('/ticket/createCategory', routes.tickets.createCategory);

app.post('/ticket/createTicket', routes.tickets.createTicket);

app.post('/tickets/userTickets', routes.tickets.fetchUserTickets);

app.post('/tickets/updateTicket', routes.tickets.updateTicket);

app.get('/ticket/categories', routes.tickets.fetchCategories);

app.get('/ticket/tickets', routes.tickets.fetchTickets);

//email 

app.post('/emailSend', routes.mailer.sendEmail);

console.log('Intranet API is starting on port 8001');