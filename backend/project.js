"use strict";

var db = require('./db');

exports.fetchProjects = function(req, res) {
    db.projectModel.find({}, function(err, projects) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        return res.send(projects);        
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
        res.sendStatus(200);
    });
}