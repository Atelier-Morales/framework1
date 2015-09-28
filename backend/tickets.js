"use strict";

var db = require('./db');

exports.fetchCategories = function(req, res) {
    db.ticketCategoriesModel.find({}, function(err, categories) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        return res.send(categories);       
    });
}

exports.fetchTickets = function(req, res) {
    db.ticketModel.find({}, function(err, tickets) {
        if (err) {
			console.log(err);
			return res.send(401);
		}
        return res.send(tickets);       
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

exports.createTicket = function(req, res) {
	var title = req.body.title || '';
    var description = req.body.description || '';
    var category = req.body.category || '';
    var author = req.body.author || '';

	if (title === '' || description === '' || category === '' || author === '')
        return res.sendStatus(400);
    
    var ticket = new db.ticketModel();
    ticket.title = title;
    ticket.author = author;
    ticket.category = category;
    ticket.body = description;
    ticket.replies = [];
    ticket.assignTo = "unassigned";
    ticket.save(function(err) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        db.ticketModel.count(function(err, counter) {
			if (err) {
				console.log(err);
				return res.sendStatus(500);
			}
			db.ticketModel.update({ title: ticket.title }, { id: counter }, function(err, nbRow) {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
				}
				console.log('Ticket number '+counter+' created');
				return res.sendStatus(200);
            });
        });
    });   
}

exports.fetchUserTickets= function(req, res) {
    var author = req.body.author || '';
    
    if (author === '')
        return res.sendStatus(400);
    
    db.ticketModel.find({author: author}, function(err, tickets) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        res.send(tickets);
    });
}

exports.updateTicket = function(req, res) {
    var assigner = req.body.assigner || '';
    var id = req.body.ticketId || '';
    var status = req.body.status || '';
    console.log(assigner+' '+id+' '+status);
    if (assigner === '' || id === '' || status === '')
        return res.sendStatus(400);
    
    db.ticketModel.findOne({id: id}, function(err, ticket) {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        ticket.status = status;
        ticket.assignTo = assigner;
        ticket.save();
        console.log("Ticket "+id+" updated");
        res.sendStatus(200);
    });
}