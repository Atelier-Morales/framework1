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