"use strict";

var db = require('./db');
var fs = require('fs');
var moment = require("moment");
var ldap = require('ldapjs-hotfix');
var jwt = require('jsonwebtoken');
var redis = require('redis');
var APIConnect = require('./oauth42');
var redisClient = redis.createClient();
var TOKEN_EXPIRATION = 60;
var API_TOKEN_EXPIRATION = 7200;
var cn = 'uid=fmorales,ou=july,ou=2013,ou=paris,ou=people,dc=42,dc=fr';


//Initialize Redis

redisClient.on('error', function (err) {
    console.log('Error ' + err);
});

redisClient.on('connect', function () {
    console.log('Redis is ready');
});

//Expire connection token

var expireToken = function (token) {
    if (token != null) {
        redisClient.set(token, {
            is_expired: true
        });
        redisClient.expire(token, 1);
    }
};

////verify if user is logged via LDAP function
//
//exports.verifyTokenLDAP = function(req, res) {
//    var token = req.body.token || '';
//    console.log(token);
//    if (token == '')
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

exports.verifyToken = function (req, res) {
    var token = req.body.token || '';
    console.log(token);
    if (token == '')
        return res.send(401);

    jwt.verify(token, 'shhhhh', function (err, decoded) {
        if (err)
            return res.send(401);
        else {
            db.userModel.findOne({
                _id: decoded.id
            }, function (err, user) {
                if (err || user === null) {
                    console.log(err);
                    return res.send(401);
                }
                return res.json({
                    username: user.username,
                    email: user.email,
                    is_admin: user.is_admin,
                    created: user.created,
                    projects: user.projects,
                    activities: user.activities,
                    corrections: user.corrections,
                    lang: user.lang
                });
            });
        }
    });
}

//Login function

exports.login = function (req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';

    if (username == '' || password == '')
        return res.send(401);

    db.userModel.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            console.log(err);
            return res.send(401);
        }
        if (user == undefined)
            return res.send(401);

        user.comparePassword(password, function (isMatch) {

            if (!isMatch) {
                console.log("Attempt failed to login with " + user.username);
                return res.send(401);
            }

            APIConnect.createAPIToken(function (error, result) {
                if (error) {
                    console.log(error);
                    return res.send(401);
                }

                var CurrentDate = moment().format('MMMM Do YYYY, h:mm:ss a');
                var configFile = fs.readFileSync('../data/log.json');
                var config = JSON.parse(configFile);
                config.push({
                    current_date: CurrentDate,
                    user: username,
                    action: "logged in",
                    log: "none"
                });
                var configJSON = JSON.stringify(config);
                fs.writeFileSync('../data/log.json', configJSON);

                var token = jwt.sign({
                        id: user._id
                    },
                    'shhhhh', {
                        expiresInMinutes: TOKEN_EXPIRATION
                    }
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

exports.loginLDAP = function (req, res) {
    var username = req.body.username || '';
    var password = req.body.password || '';

    if (username == '' || password == '')
        return res.send(401);

    console.log(cn);
    console.log(username);

    // Create LDAP client

    var client = ldap.createClient({
        url: 'ldaps://ldap.42.fr:636'
    });

    client.bind(cn, 'INSERTPASSHERE', function (err) {
        if (err) {
            console.log(err);
            console.log("fail");
            client.unbind();
            return res.send(401);
        } else {
            client.search('ou=paris,ou=people,dc=42,dc=fr', {
                scope: 'sub',
                attributes: ['uidNumber', 'uid', 'givenName', 'sn', 'mobile', 'alias'],
                timeLimit: 600
            }, function (err, data) {

                var entries = {};

                console.log('login success : ' + username);
                var found = false;
                var dn = '';
                data.on('searchEntry', function (entry) {

                    var match = entry.object.dn.match('uid=' + username);

                    if (match) {
                        found = true;
                        dn = entry.object.dn;
                        this.emit("end");
                    }
                });
                data.on('end', function (result) {
                    if (found) {
                        found = false;
                        client.bind(dn, password, function (err) {
                            if (err) {
                                console.log("wrong password");
                                return res.send(500);
                            } else {
                                console.log('success');
                                db.userModel.findOne({
                                    username: username
                                }, function (err, user) {
                                    if (err || user == undefined) {
                                        console.log("User not in db, creating user");

                                        var newUser = new db.userModel();
                                        newUser.username = username;
                                        newUser.email = username + '@student.42.fr';
                                        newUser.password = password;
                                        newUser.ldap = true;

                                        newUser.save(function (err) {
                                            if (err) {
                                                console.log(err);
                                                return res.sendStatus(500);
                                            }

                                            db.userModel.count(function (err, counter) {
                                                if (err) {
                                                    console.log(err);
                                                    return res.sendStatus(500);
                                                }

                                                if (counter == 1) {
                                                    db.userModel.update({
                                                        username: newUser.username
                                                    }, {
                                                        is_admin: true
                                                    }, function (err, nbRow) {
                                                        if (err) {
                                                            console.log(err);
                                                            return res.sendStatus(500);
                                                        }
                                                        console.log('First user created as an Admin');
                                                    });
                                                } else
                                                    console.log(newUser);
                                                APIConnect.createAPIToken(function (error, result) {
                                                    if (error) {
                                                        console.log(error);
                                                        return res.send(401);
                                                    }
                                                    var token = jwt.sign({
                                                            id: newUser._id
                                                        },
                                                        'shhhhh', {
                                                            expiresInMinutes: TOKEN_EXPIRATION
                                                        }
                                                    );
                                                    return res.json({
                                                        token: token,
                                                        APIToken: result
                                                    });

                                                });
                                            });
                                        });
                                    } else {
                                        APIConnect.createAPIToken(function (error, result) {
                                            if (error) {
                                                console.log(error);
                                                return res.send(401);
                                            }
                                            var token = jwt.sign({
                                                    id: user._id
                                                },
                                                'shhhhh', {
                                                    expiresInMinutes: TOKEN_EXPIRATION
                                                }
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
                    } else {
                        console.log('user not found in ldap');
                        client.unbind();
                        return res.sendStatus(401);
                    }
                });
            });
        }
    });
}

// Log As function

exports.logAs = function (req, res) {
    var username = req.body.username || '';

    if (username == '')
        return res.send(401);
    console.log(username);
    db.userModel.findOne({
        username: username
    }, function (err, user) {
        if (err || user === undefined || user === null) {
            console.log('user not found in db trying with ldap...');

            // Create LDAP client

            var client = ldap.createClient({
                url: 'ldaps://ldap.42.fr:636'
            });
            client.bind(cn, 'INSERTPASSHERE', function (err) {
                if (err) {
                    console.log(err);
                    console.log("fail");
                    client.unbind();
                    return res.send(401);
                } else {
                    client.search('ou=paris,ou=people,dc=42,dc=fr', {
                        scope: 'sub',
                        attributes: ['uidNumber', 'uid', 'givenName', 'sn', 'mobile', 'alias'],
                        timeLimit: 600
                    }, function (err, data) {
                        var found = false;
                        data.on('searchEntry', function (entry) {
                            var match = entry.object.dn.match('uid=' + username);
                            if (match) {
                                found = true;
                                console.log('test');
                                //this.emit("end");
                            }
                        });
                        data.on('end', function (result) {
                            if (found) {
                                found = false;
                                console.log("User found in ldap but not in db, creating user");
                                setTimeout(function () {
                                    var newUser = new db.userModel();
                                    newUser.username = username;
                                    newUser.email = username + '@student.42.fr';
                                    newUser.password = 'test';
                                    newUser.logAs = true;
                                    newUser.ldap = true;
                                    newUser.save(function (err) {
                                        if (err) {
                                            console.log(err);
                                            client.unbind();
                                            return res.sendStatus(500);
                                        }
                                        console.log(newUser);
                                        APIConnect.createAPIToken(function (error, result) {
                                            if (error) {
                                                console.log(error);
                                                client.unbind();
                                                return res.send(401);
                                            }
                                            var token = jwt.sign({
                                                    id: newUser._id
                                                },
                                                'shhhhh', {
                                                    expiresInMinutes: TOKEN_EXPIRATION
                                                });
                                            client.unbind();
                                            return res.json({
                                                token: token,
                                                APIToken: result,
                                                logAs: true
                                            });
                                        });
                                    });
                                });
                            } else {
                                console.log('user not found in ldap');
                                client.unbind();
                                return res.sendStatus(500);
                            }
                        });

                    });
                }
            });
        } else {
            console.log('He is here');
            APIConnect.createAPIToken(function (error, result) {
                if (error) {
                    console.log(error);
                    return res.send(401);
                }

                var CurrentDate = moment().format('MMMM Do YYYY, h:mm:ss a');
                var configFile = fs.readFileSync('../data/log.json');
                var config = JSON.parse(configFile);
                config.push({
                    current_date: CurrentDate,
                    user: username,
                    action: "logged in",
                    log: "none"
                });
                var configJSON = JSON.stringify(config);
                fs.writeFileSync('../data/log.json', configJSON);

                var token = jwt.sign({
                        id: user._id
                    },
                    'shhhhh', {
                        expiresInMinutes: TOKEN_EXPIRATION
                    }
                );
                return res.json({
                    token: token,
                    APIToken: result,
                    logAs: true
                });

            });
        }
    });
}

//Logout function

exports.logout = function (req, res) {

    var CurrentDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    var configFile = fs.readFileSync('../data/log.json');
    var config = JSON.parse(configFile);
    config.push({
        current_date: CurrentDate,
        user: req.body.username,
        action: "logged out",
        log: "none"
    });
    var configJSON = JSON.stringify(config);
    fs.writeFileSync('../data/log.json', configJSON);

    if (req.body.token) {
        expireToken(req.body.token)
        return res.send(200);
    } else
        return res.send(401);
}

//Signup function

exports.register = function (req, res) {
    var username = req.body.username || '';
    var email = req.body.email || '';
    var password = req.body.password || '';
    var passwordConfirmation = req.body.passwordConfirmation || '';

    if (username == '' || password == '' || password != passwordConfirmation)
        return res.sendStatus(400);

    var user = new db.userModel();
    user.username = username;
    user.email = email;
    user.password = password;

    user.save(function (err) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }

        db.userModel.count(function (err, counter) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }

            if (counter == 1) {
                db.userModel.update({
                    username: user.username
                }, {
                    is_admin: true
                }, function (err, nbRow) {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    console.log('First user created as an Admin');
                    var CurrentDate = moment().format('MMMM Do YYYY, h:mm:ss a');
                    var configFile = fs.readFileSync('../data/log.json');
                    var config = JSON.parse(configFile);
                    config.push({
                        current_date: CurrentDate,
                        user: user.username,
                        action: "registered",
                        log: "none"
                    });
                    var configJSON = JSON.stringify(config);
                    fs.writeFileSync('../data/log.json', configJSON);
                    return res.sendStatus(200);
                });
            } else {
                console.log(user);
                var CurrentDate = moment().format('MMMM Do YYYY, h:mm:ss a');
                var configFile = fs.readFileSync('../data/log.json');
                var config = JSON.parse(configFile);
                config.push({
                    current_date: CurrentDate,
                    user: user.username,
                    action: "registered",
                    log: "none"
                });
                var configJSON = JSON.stringify(config);
                fs.writeFileSync('../data/log.json', configJSON);
                return res.sendStatus(200);
            }
        });
    });
}

// Fetch Users info function

exports.fetchUsers = function (req, res) {
    db.userModel.find({}, function (err, users) {
        if (err) {
            console.log(err);
            return res.send(401);
        }
        if (users == undefined)
            return res.send(401);
        return res.send(users);
    });
}

exports.updateUser = function (req, res) {
    var username = req.body.username;
    var oldUsername = req.body.oldUsername;
    var email = req.body.email;
    if (req.body.role === "true")
        var role = true;
    else
        var role = false;

    db.userModel.findOne({
        username: req.body.oldUsername
    }, function (err, doc) {
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

exports.removeUser = function (req, res) {
    db.userModel.findOneAndRemove({
        username: req.body.username
    }, function (err, doc) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        console.log(doc + " deleted from db");
        return res.sendStatus(200);
    });
}

exports.registerProject = function (req, res) {
    var name = req.body.name || '';
    var username = req.body.username || '';
    var deadline = req.body.deadline || '';

    if (name == '' || username == '' || deadline == '')
        return res.sendStatus(400);
    db.userModel.findOne({
        username: username
    }, function (err, doc) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        var credits = 0;
        db.projectModel.findOne({name: name}, function (err, data) {
            if (err)
                console.log(err);
            credits = data.credits;
            console.log("CREDITS = "+credits);
            var project = {
                name: name,
                deadline: deadline,
                credits: credits
            }
            doc.projects.push(project);
            doc.save();
            console.log("registered to project " + name);
            return res.sendStatus(200);
        });
    });
}

exports.registerActivity = function (req, res) {
    var name = req.body.name || '';
    var username = req.body.username || '';
    var project = req.body.project || '';

    if (name == '' || username == '' || project == '')
        return res.sendStatus(400);
    db.userModel.findOne({
        username: username
    }, function (err, doc) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }

        if (project.group_size == 1) {
            var activity = {
                name: project.name,
                parentModule: name,
                deadline: project.deadline,
                neededCorrections: project.nb_peers,
                groupSize: project.group_size,
                users: [
                    {
                        name: username
                    }
                ]
            };
            doc.activities.push(activity);
            doc.save();
            console.log("registered to project " + project.name);
            return res.sendStatus(200);
        } else {
            var otherUsers = [];
            var Users = [];
            otherUsers.push(username);
            db.userModel.find({}, function (err, data) {
                var random = Math.floor((Math.random() * data.length) + 0);
                for (var i = 1; i < project.group_size; i++) {
                    while (otherUsers.indexOf(data[random].username) > -1)
                        random = Math.floor((Math.random() * data.length) + 0);
                    otherUsers.push(data[random].username);
                }

                for (var l = 0; l < project.group_size; l++)
                    Users.push({name: otherUsers[l]});

                for (var j = 0; j < project.group_size; j++) {
                    db.userModel.findOne({
                        username: otherUsers[j]
                    }, function (err, users) {
                        if (err) {
                            console.log(err)
                            return res.sendStatus(502);
                        }
                        var activity = {
                            name: project.name,
                            parentModule: name,
                            deadline: project.deadline,
                            neededCorrections: project.nb_peers,
                            groupSize: project.group_size,
                            users: Users
                        };
                        users.activities.push(activity);
                        users.save();
                        console.log("registered to project " + project.name);
                    });
                }
                return res.sendStatus(200);
            });

        }
    });
}

exports.registerTeam = function (req, res) {
    var project = req.body.project || '';
    var module = req.body.module || '';
    var username = req.body.username || '';
    var users = req.body.users || '';

    if (project == '' || module == '' || username == '' || users == '')
        return res.sendStatus(400);

    db.userModel.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            console.error(err);
            return res.sendStatus(500);
        }

        var batch = [];
        for (var i = 0; i < users.length; i++)
            batch.push({
                name: users[i]
            });

        var activity = {
            name: project.name,
            parentModule: module,
            deadline: project.deadline,
            neededCorrections: project.nb_peers,
            groupSize: project.group_size,
            users: batch
        }

        user.activities.push(activity);

        for (var j = 1; j < users.length; j++) {
            db.userModel.findOne({
                username: users[j]
            }, function (err, res) {
                if (err) {
                    console.error(err);
                    return res.sendStatus(501);
                }
                res.activities.push(activity);
                res.save(function (err) {
                    if (err) {
                        console.log(err);
                        res.sendStatus(502);
                    }
                });
            });
        }
        user.save();
        return res.sendStatus(200);
    });
}

exports.completeProject = function (req, res) {
    var name = req.body.name || '';
    var username = req.body.username || '';

    console.log('test ' + name + ' ' + username);

    if (name == '' || username == '')
        return res.sendStatus(400);
    db.userModel.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        var i = 0;
        for (; i < user.activities.length; ++i) {
            if (name === user.activities[i].name) {
                break;
            }
        }
        var otherUsers = [];
        for (var l = 0; l < user.activities[i].users.length; l++) {
            if (user.activities[i].users[l].name != user.username)
                otherUsers.push(user.activities[i].users[l].name);
        }
        var correctors = [];
        if (otherUsers.length > 0) {
            db.userModel.find({}, function (err, users) {
                for (var j = 0; j < user.activities[i].neededCorrections; j++) {
                    var random = Math.floor((Math.random() * users.length) + 0);

                    while (users[random].username == user.username || correctors.indexOf(users[random].username) > -1 || otherUsers.indexOf(users[random].username) > -1)
                        random = Math.floor((Math.random() * users.length) + 0);

                    var correction = {
                        project: name,
                        module: user.activities[i].parentModule,
                        user: username
                    };

                    correctors.push(users[random].username);
                    users[random].corrections.push(correction);
                    users[random].save();
                }

                for (var m = 0; m < otherUsers.length; m++) {
                    db.userModel.findOne({
                        username: otherUsers[m]
                    }, function (err, data) {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(503);
                        }
                        for (var n = 0; n < data.activities.length; n++) {
                            if (data.activities[n].name === name) {
                                data.activities[n].submitted = moment().format('MMMM Do YYYY, h:mm:ss a');
                                for (var x = 0; x < correctors.length; x++) {
                                    data.activities[n].correctors.push({
                                        name: correctors[x],
                                        completed: false
                                    });
                                }
                                break;
                            }
                        }
                        data.save();
                    });
                }

                for (var x = 0; x < correctors.length; x++) {
                    user.activities[i].correctors.push({
                        name: correctors[x],
                        completed: false
                    });
                }

                user.activities[i].submitted = moment().format('MMMM Do YYYY, h:mm:ss a');
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(502);
                    }
                    return res.sendStatus(200);
                });

            });
        } else {
            db.userModel.find({}, function (err, users) {
                for (var j = 0; j < user.activities[i].neededCorrections; j++) {

                    var random = Math.floor((Math.random() * users.length) + 0);

                    while (users[random].username == user.username || correctors.indexOf(users[random].username) > -1)
                        random = Math.floor((Math.random() * users.length) + 0);

                    var correction = {
                        project: name,
                        module: user.activities[i].parentModule,
                        user: username
                    };

                    correctors.push(users[random].username);
                    users[random].corrections.push(correction);
                    users[random].save();
                }
                for (var x = 0; x < correctors.length; x++) {
                    user.activities[i].correctors.push({
                        name: correctors[x],
                        completed: false
                    });
                }
                user.activities[i].submitted = moment().format('MMMM Do YYYY, h:mm:ss a');
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(502);
                    }
                    return res.sendStatus(200);
                });
            });
        }
    });
}

exports.correctProject = function (req, res) {
    var username = req.body.username || '';
    var correctee = req.body.correctee || '';
    var project = req.body.project || '';
    var grade = req.body.grade;

    console.log(grade);

    if (username === '' || correctee === '' || project === '')
        return res.sendStatus(400);

    db.userModel.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        var i = 0;
        for (; i < user.corrections.length; i++) {
            if (user.corrections[i].project === project && user.corrections[i].user === correctee)
                break;
        }
        user.corrections[i].grade = grade;
        user.corrections[i].completed = true;
        user.save();
        db.userModel.findOne({
            username: correctee
        }, function (err, result) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }

            var j = 0;
            var check = true;
            var finalGrade = 0;
            for (; j < result.activities.length; j++) {
                if (result.activities[j].name === project) {
                    for (var y = 0; y < result.activities[j].users.length; y++) {
                        db.userModel.findOne({
                            username: result.activities[j].users[y].name
                        }, function (err, data) {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(504);
                            }
                            var finalGrade = 0;
                            var check = true;
                            for (var z = 0; z < data.activities.length; z++) {
                                if (data.activities[z].name == project) {
                                    for (var k = 0; k < data.activities[z].correctors.length; k++) {
                                        if (data.activities[z].correctors[k].name === username) {
                                            data.activities[z].correctors[k].completed = true;
                                            data.activities[z].correctors[k].grade = grade;
                                        }
                                        if (data.activities[z].correctors[k].completed == false)
                                            check = false;
                                    }
                                    if (check == true) {
                                        for (var w = 0; w < data.activities[z].correctors.length; w++)
                                            finalGrade += data.activities[z].correctors[w].grade;
                                        data.activities[z].status = "finished";
                                        data.activities[z].grade = finalGrade / data.activities[z].neededCorrections;
                                    }
                                }
                            }
                            data.save(function (err) {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(503);
                                }
                            });
                        });
                    }
                    return res.sendStatus(200);
                }
            }
        });
    });
}

exports.changeLanguage = function (req, res) {
    var username = req.body.user || '';
    var language = req.body.lang || '';

    if (username === '' || language === '')
        return res.sendStatus(400);

    db.userModel.findOne({
        username: username
    }, function (err, user) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        user.lang = language;
        user.save();
        return res.send(user.lang);
    });
}

exports.getLanguage = function (req, res) {
    var username = req.body.user || '';

    if (username === '' || username === null)
        return res.sendStatus(400);

    db.userModel.findOne({
        username: username
    }, function (err, user) {
        if (err || user === null) {
            console.log(err);
            return res.sendStatus(401);
        }
        var lang = user.lang;
        return res.send(lang);
    });
}

exports.logAction = function (req, res) {
    var log = req.body.log || '';
    var action = req.body.action || '';
    var user = req.body.user || '';
    if (log == '' || action == '' || user == '')
        return res.sendStatus(400);
    var CurrentDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    var configFile = fs.readFileSync('../data/log.json');
    var config = JSON.parse(configFile);
    config.push({
        current_date: CurrentDate,
        user: user,
        action: action,
        log: log
    });
    var configJSON = JSON.stringify(config);
    fs.writeFileSync('../data/log.json', configJSON);
    return res.sendStatus(200);
}

exports.removeLoggedAs = function (req, res) {
    db.userModel.remove({
        logAs: true
    }, function (err) {
        if (err) {
            console.error('could not remove log as users');
            return res.sendStatus(500);
        }
        console.log('Removed logAs users');
        return res.sendStatus(200);
    });
}

exports.clearLogs = function (req, res) {
    var configFile = fs.readFileSync('../data/log.json');
    var config = JSON.parse(configFile);
    config = [];
    var configJSON = JSON.stringify(config);
    fs.writeFileSync('../data/log.json', configJSON);
    return res.sendStatus(200);
}
