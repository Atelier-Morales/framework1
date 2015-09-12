"use strict";

var db = require('./db');

exports.fetchProjects = function(req, res) {
    db.projectModel.find({}, function(err, projects) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        db.userModel.findOne({ username: req.body.username }, function(err, user) {
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

exports.createProject = function(req, res) {
	var name = req.body.name || '';
    var deadline    = req.body.deadline    || '';
	var description = req.body.description || '';

	if (name == '' || deadline == '' || description == '')
        return res.sendStatus(400);

	var project = new db.projectModel();
	project.name = name;
    project.deadline = deadline;
	project.description = description;

	project.save(function(err) {
		if (err) {
			console.log(err);
			return res.sendStatus(500);
		}
		db.projectModel.findOne({ name: name }, function (err, project) {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			}
            console.log(project.name+" created!");
            return res.sendStatus(200);
		});
	});
}

exports.deleteProject = function(req, res) {
    db.projectModel.findOneAndRemove({ name: req.body.name }, function (err, doc) {
        if (err) {
            console.log(err);
			return res.sendStatus(401);
        }
        console.log(doc+" deleted from db");
        return res.sendStatus(200);
    });
}

exports.updateProject = function(req, res) {
    console.log(req.body);
    db.projectModel.findOne({ name: req.body.oldname }, function(err, project) {
        if (err || project === null) {
            console.log(err);
            return res.sendStatus(401);
        }
        console.log(project+"   FUCK");
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