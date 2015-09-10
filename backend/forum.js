"use strict";

var db = require('./db');

exports.fetchCategories = function(req, res) {
    db.forumModel.find({}, function(err, categories) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        console.log(categories[0].categories);
        return res.send(categories[0].categories);       
    });
}

exports.createCategory = function(req, res) {
	var name = req.body.name || '';

	if (name == '')
        return res.sendStatus(400);
    
    db.forumModel.find({}, function(err, category) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        if (category.length === 0) {
            console.log('creating forum');
            var forum = new db.forumModel();
	        forum.categories = [];
            forum.categories.push({name: name, id: 0, thread: []});
            forum.save(function(err) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                db.forumModel.find({}, function (err, forum) {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    console.log("forum created!");
                    return res.send(forum);
                });
            });
        }
        category[0].categories.push({name: name, id: category[0].categories.length, thread: []});
        category[0].save(function(err) {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            db.forumModel.find({}, function (err, forum) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                console.log(name+" created!");
                return res.send(forum);
            });
        });     
    });
}
/*
exports.deleteCategory = function(req, res) {
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
}*/