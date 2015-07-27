"use strict";

var db = require('./db');
var jwt = require('jsonwebtoken');
var redis = require('redis');
var redisClient = redis.createClient();
var TOKEN_EXPIRATION = 60;

//Initialize Redis

redisClient.on('error', function (err) {
    console.log('Error ' + err);
});

redisClient.on('connect', function () {
    console.log('Redis is ready');
});

//Expire connection token

var expireToken = function(token) {
	if (token != null) {
		redisClient.set(token, { is_expired: true });
    	redisClient.expire(token, 1);
	}
};

//verify if user is logged function

exports.verifyToken = function(req, res) {
	var token = req.body.token || '';
	
	if (token == '')
        return res.send(401);
    
    jwt.verify(token, 'shhhhh', function(err, decoded) {
        if (err)
            return res.send(401);
        else {
            db.userModel.findOne({ _id: decoded.id }, function (err, user) {
                if (err) {
                    console.log(err);
                    return res.send(401);
                }
                return res.json({ 
                    username: user.username,
                    email   : user.email,
                    is_admin: user.is_admin,
                    created : user.created
                });
            });
        }       
    });
}


//Login function

exports.login = function(req, res) {
	var username = req.body.username || '';
	var password = req.body.password || '';
	
	if (username == '' || password == '')
        return res.send(401);

	db.userModel.findOne({ username: username }, function (err, user) {
		if (err) {
			console.log(err);
			return res.send(401);
		}
		if (user == undefined)
            return res.send(401);
		
		user.comparePassword(password, function(isMatch) {
			if (!isMatch) {
				console.log("Attempt failed to login with " + user.username);
				return res.send(401);
            }
            
            var token = jwt.sign(
                { id: user._id }, 
                'shhhhh', 
                { expiresInMinutes: TOKEN_EXPIRATION }
            );
            
			return res.json({ 
                token: token
            });
		});
	});
}

//Logout function

exports.logout = function(req, res) {
	if (req.body.token) {
        expireToken(req.body.token)	
		return res.send(200);
	}
	else
        return res.send(401);
}

//Signup function

exports.register = function(req, res) {
	var username = req.body.username || '';
    var email    = req.body.email    || '';
	var password = req.body.password || '';
	var passwordConfirmation = req.body.passwordConfirmation || '';

	if (username == '' || password == '' || password != passwordConfirmation)
        return res.sendStatus(400);

	var user = new db.userModel();
	user.username = username;
    user.email    = email;
	user.password = password;

	user.save(function(err) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}
		
		db.userModel.count(function(err, counter) {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			}

			if (counter == 1) {
				db.userModel.update({username:user.username}, {is_admin:true}, function(err, nbRow) {
					if (err) {
						console.log(err);
						return res.sendStatus(500);
					}
					console.log('First user created as an Admin');
					return res.sendStatus(200);
				});
			} 
			else {
                console.log(user);
				return res.sendStatus(200);
			}
		});
	});
}

// Fetch Users info function

exports.fetchUsers = function(req, res) {
    db.userModel.find({}, function(err, users) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
		if (users == undefined)
            return res.send(401);
        return res.send(users);        
    });
}

exports.updateUser = function(req, res) {
    
    console.log(req.body);
    
    return res.sendStatus(200);
}