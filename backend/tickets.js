"use strict";

var db = require('./db');

exports.fetchCategories = function(req, res) {
    db.ticketCategoriesModel.find({}, function(err, categories) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        console.log(categories);
        return res.send(categories);       
    });
}

exports.createCategory = function(req, res) {
	var name = req.body.name || '';

	if (name == '')
        return res.sendStatus(400);
    
    console.log('creating category '+name);
    var ticketCategory = new db.ticketCategoriesModel();
    ticketCategory.title = name;
    ticketCategory.save(function(err) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        console.log("category "+name+" created!");
        return res.sendStatus(200);
    });
}