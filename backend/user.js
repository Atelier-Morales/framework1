"use strict";

var db = require('./db');
var ldap = require('ldapjs-hotfix');
var jwt = require('jsonwebtoken');
var redis = require('redis');
var APIConnect = require('./oauth42');
var redisClient = redis.createClient();
var TOKEN_EXPIRATION = 60;
var API_TOKEN_EXPIRATION = 7200;

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

////verify if user is logged via LDAP function
//
//exports.verifyTokenLDAP = function(req, res) {
//	var token = req.body.token || '';
//	console.log(token);
//	if (token == '')
//        return res.send(401);
//    
//    jwt.verify(token, 'shhhhh', function(err, decoded) {
//        if (err)
//            return res.send(401);
//        else {
//            console.log(decoded.id);
//            return res.json({ 
//                    username: decoded.id
//            });
//        }       
//    });
//}

//verify if user is logged function

exports.verifyToken = function(req, res) {
	var token = req.body.token || '';
	console.log(token);
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
                    created : user.created,
                    projects: user.projects,
                    lang: user.lang
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

            APIConnect.createAPIToken(function(error, result) {
                if (error) {
                    console.log(error);
                    return res.send(401);
                }
                var token = jwt.sign(
                    { id: user._id }, 
                    'shhhhh', 
                    { expiresInMinutes: TOKEN_EXPIRATION }
                );
                return res.json({ 
                    token: token,
                    APIToken: result
                });
    
            });
        });
	});
}

// login LDAP 42

exports.loginLDAP = function(req, res) {
	var username = req.body.username || '';
	var password = req.body.password || '';
	
	if (username == '' || password == '')
        return res.send(401);
    
    var cn = 'uid=fmorales,ou=july,ou=2013,ou=paris,ou=people,dc=42,dc=fr';
    
    console.log(cn);
    console.log(username);
    
    // Create LDAP client
    
    var client = ldap.createClient({
        url: 'ldaps://ldap.42.fr:636'
    });
    
    client.bind(cn, '', function(err) {
        if (err) {
            console.log(err);
            console.log("fail");
            client.unbind();
            return res.send(401);
        }
        else {
            client.search('ou=paris,ou=people,dc=42,dc=fr', {
                scope: 'sub',
                attributes: ['uidNumber', 'uid', 'givenName', 'sn', 'mobile', 'alias'],
                timeLimit: 600
            }, function (err, data) {
                
                var entries = {};
                
                console.log('login success : '+username);
                
                data.on('searchEntry', function (entry) {
                    
                    var match = entry.object.dn.match('uid='+username);
                    
                    if (match) {
                        var dn = entry.object.dn;
                        
                        client.bind(dn, password, function(err) {
                            if (err) {
                                console.log("wrong password");
                                client.unbind();
                                return res.send(500);
                            }
                            else {
                                console.log('success');
                                db.userModel.findOne({ username: username }, function (err, user) {
                                    if (err || user == undefined) {
                                        console.log("User not in db, creating user");
                                        
                                        var newUser = new db.userModel();
                                        newUser.username = username;
                                        newUser.email    = username+'@student.42.fr';
                                        newUser.password = password;
                                        newUser.ldap = true;

                                        newUser.save(function(err) {
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
                                                    });
                                                } 
                                                else
                                                    console.log(newUser);
                                                var token = jwt.sign(
                                                    { id: newUser._id }, 
                                                    'shhhhh', 
                                                    { expiresInMinutes: TOKEN_EXPIRATION }
                                                );

                                                return res.json({ 
                                                    token: token
                                                });
                                            });
                                        });    
                                    }
                                    else {
                                        APIConnect.createAPIToken(function(error, result) {
                                            if (error) {
                                                console.log(error);
                                                return res.send(401);
                                            }
                                            var token = jwt.sign(
                                                { id: user._id }, 
                                                'shhhhh', 
                                                { expiresInMinutes: TOKEN_EXPIRATION }
                                            );
                                            return res.json({ 
                                                token: token,
                                                APIToken: result
                                            });

                                        });
                                    }
                                });
                            }
                        });
                    }
                });
                data.on('end', function (result) {
                    console.log('status: ' + result.status);
                    client.unbind();
                });
            });
        }
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
    var username = req.body.username;
    var oldUsername = req.body.oldUsername;
    var email = req.body.email;
    if (req.body.role === "true")
        var role = true;
    else
        var role = false;
    
    db.userModel.findOne({ username: req.body.oldUsername }, function (err, doc) {
        if (err) {
            console.log(err);
			return res.send(401);
        }
        if (doc.username != username)
            doc.username = username;
        if (doc.email != email)
            doc.email = email;
        if (doc.is_admin != role)
            doc.is_admin = role;
        
        doc.save();
        
        console.log(doc);
        
        return res.send(doc);
    });
}

exports.removeUser = function(req, res) {
    db.userModel.findOneAndRemove({ username: req.body.username }, function (err, doc) {
        if (err) {
            console.log(err);
			return res.sendStatus(401);
        }
        console.log(doc+" deleted from db");
        return res.sendStatus(200);
    });
}

exports.registerProject = function(req, res) {
    var name        = req.body.name        || '';
    var username    = req.body.username    || '';
    var deadline    = req.body.deadline    || '';

	if (name == '' || username == '' || deadline == '')
        return res.sendStatus(400);
    db.userModel.findOne({ username: username }, function (err, doc) {
        if (err) {
            console.log(err);
			return res.sendStatus(401);
        }
        var project = {
            name: name,
            deadline: deadline
        }
        doc.projects.push(project);
        doc.save();
        console.log("registered to project "+name);
        return res.sendStatus(200);
    });
}

exports.completeProject = function(req, res) {
    var name        = req.body.name        || '';
    var username    = req.body.username    || '';
    var grade       = req.body.grade       || '';

	if (name == '' || username == '' || grade == '')
        return res.sendStatus(400);
    db.userModel.findOne({ username: username }, function(err, user) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        for (var i = 0; i < user.projects.length; ++i) {
            if (name === user.projects[i].name) {
                user.projects[i].status = "finished";
                user.projects[i].grade = grade;
                user.save();
                return res.sendStatus(200);
            }
        }
    });
}

exports.changeLanguage = function(req, res) {
    var username = req.body.user || '';
    var language = req.body.lang || '';
    
    if (username === '' || language === '')
        return res.sendStatus(400);
    
    db.userModel.findOne({ username: username }, function(err, user) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        user.lang = language;
        user.save();
        return res.send(user.lang);
    });
}

exports.getLanguage = function(req, res) {
    var username = req.body.user || '';
    
    if (username === '')
        return res.sendStatus(400);
    
    db.userModel.findOne({ username: username }, function(err, user) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        var lang = user.lang;
        return res.send(lang);
    });
}