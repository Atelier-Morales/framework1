"use strict";

var path = require('path'),
    fs = require('fs');
var db = require('./db');

exports.fetchProjects = function (req, res) {
    db.projectModel.find({}, function (err, projects) {
        if (err) {
            console.log(err);
            return res.send(401);
        }
        db.userModel.findOne({
            username: req.body.username
        }, function (err, user) {
            if (err) {
                console.log(err);
                return res.send(401);
            }
            var proj = [];
            for (var i = 0; i < projects.length; ++i) {
                var flag = false;
                for (var j = 0; j < user.projects.length; ++j) {
                    if (projects[i].name === user.projects[j].name)
                        flag = true;
                }
                if (!flag)
                    proj.push(projects[i]);
            }
            return res.send(proj);
        });
    });
}

exports.fetchAllProjects = function (req, res) {
    db.projectModel.find({}, function (err, projects) {
        if (err) {
            console.log(err);
            return res.send(401);
        }
        return res.send(projects);
    });
}

exports.createProject = function (req, res) {
    var name = req.body.name || '';
    var credits = req.body.credits || '';
    var size = req.body.size || '';
    var regStart = req.body.regStart || '';
    var regClose = req.body.regClose || '';
    var start = req.body.start || '';
    var deadline = req.body.deadline || '';
    var description = req.body.description || '';

    if (name == '' || deadline == '' || description == '' || credits == '' || size == '' || regStart == '' || regClose == '' || start == '')
        return res.sendStatus(400);

    var project = new db.projectModel();
    project.name = name;
    project.deadline = deadline;
    project.description = description;
    project.start = start;
    project.registration_start = regStart;
    project.registration_end = regClose;
    project.credits = credits;
    project.max_size = size;
    project.activities = [];
    project.save(function (err) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        db.projectModel.findOne({
            name: name
        }, function (err, project) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            console.log(project.name + " created!");
            return res.sendStatus(200);
        });
    });
}

exports.deleteProject = function (req, res) {
    db.projectModel.findOneAndRemove({
        name: req.body.name
    }, function (err, doc) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        db.forumModel.find({}, function (err, category) {
            var i = 0;
            for (; i < category[0].categories.length; ++i) {
                if (category[0].categories[i].name === req.body.name)
                    break;
            }
            category[0].categories.splice(i, 1);
            var k = 0;
            for (; k < category[0].threads.length; ++k) {
                if (category[0].threads[k].category[0].name === req.body.name)
                    break;
            }
            category[0].threads.splice(k, 1);
            category[0].save(function (err) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                db.forumModel.find({}, function (err, forum) {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    console.log(req.body.name + " deleted");
                    console.log(doc + " deleted from db");
                    return res.sendStatus(200);
                });
            });
        });
    });
}

exports.deleteActivity = function (req, res) {
    db.projectModel.findOne({
        name: req.body.moduleName
    }, function (err, doc) {
        if (err) {
            console.error(err);
            return res.sendStatus(401);
        }
        var i = 0;
        for (; i < doc.activities.length; i++) {
            if (req.body.name == doc.activities[i].name)
                break;
        }
        fs.unlink("/nfs/zfs-student-3/users/fmorales/Documents/rendu/bgw/assets/subjects/" + doc.activities[i].subject, function (err) {
            console.log("subject deleted")
        });
        doc.activities.splice(i, 1);

        db.forumModel.find({}, function (err, category) {
            var i = 0;
            for (; i < category[0].categories.length; ++i) {
                if (category[0].categories[i].name === req.body.moduleName)
                    break;
            }
            var j = 0;
            for (; j < category[0].categories[i].subCategories.length; ++j) {
                if (category[0].categories[i].subCategories[j].name === req.body.name)
                    break;
            }
            category[0].categories[i].subCategories.splice(j, 1);
            for (var k = 0; k < category[0].threads.length; ++k) {
                if (category[0].threads[k].category[1].name === req.body.name) {
                    category[0].threads.splice(k, 1);
                }
            }
            category[0].save(function (err) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                console.log(subcategoria + " deleted");
            });
            doc.save(function (err) {
                if (err) {
                    console.error(err);
                    return res.sendStatus(500);
                }
                console.log('project removed');
                return res.sendStatus(200);
            });
        });
    });
}

exports.updateProject = function (req, res) {
    console.log(req.body);
    db.projectModel.findOne({
        name: req.body.oldname
    }, function (err, project) {
        if (err || project === null) {
            console.log(err);
            return res.sendStatus(401);
        }
        if (project.name != req.body.name)
            project.name = req.body.name;
        if (project.deadline != req.body.deadline)
            project.deadline = req.body.deadline;
        if (project.description != req.body.description)
            project.description = req.body.description;
        project.save();

        console.log(project);

        return res.sendStatus(200);
    });
}

exports.createActivity = function (req, res) {

    var file = req.body.subject;
    var moduleName = req.body.moduleName;

    db.projectModel.findOne({
        name: moduleName
    }, function (err, result) {
        var project = {
            name: req.body.name,
            start: req.body.start,
            deadline: req.body.deadline,
            registration_start: req.body.registration_start,
            registration_end: req.body.registration_end,
            description: req.body.description,
            subject: file,
            group_size: req.body.group_size,
            max_size: req.body.max_size,
            nb_peers: req.body.nb_peers,
            automatic_group: req.body.automatic_group,
            activity_type: req.body.activity_type,
            bareme: ""
        }
        result.activities.push(project);
        result.save(function (err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            console.log("success");
            return res.sendStatus(200);
        });
    });

}


exports.uploadSubject = function (req, res) {
    // We are able to access req.files.file thanks to
    // the multiparty middleware

    var file = req.files.file;
    console.log(file);
    fs.readFile(file.path, function (err, data) {
        // ...
        var newPath = "/nfs/zfs-student-3/users/fmorales/Documents/rendu/bgw/assets/subjects/" + file.name;
        fs.writeFile(newPath, data, function (err) {
            if (err)
                console.log(err);
            console.log("success");
        });
    });
}
