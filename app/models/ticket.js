"use strict";

/* global angular */

/**
 * Angular services for ticket management
 * @author Fernan Morales <fmorales@student.42.fr>
 */

(function () {
    var forum = angular.module('ticketModel', []);
    
    forum.factory('ticketService', function($http) {
        return {
            fetchCategories: function() {
                return $http.get(API_URL + '/ticket/categories');
            },
            fetchTickets: function() {
                return $http.get(API_URL + '/ticket/tickets');
            },
            fetchUserTickets: function(author) {
                return $http.post(API_URL + '/ticket/userTickets', {
                    author: author
                });
            },
            createCategory: function(name) {
                return $http.post(API_URL + '/ticket/createCategory', {
                    name: name
                });
            },
            createTicket: function(title, description, category, author) {
                return $http.post(API_URL + '/ticket/createTicket', {
                    title: title,
                    description: description,
                    category: category,
                    author: author
                });
            },
            updateTicket: function(assigner, status, ticketId) {
                return $http.post(API_URL + '/ticket/updateTicket', {
                    assigner: assigner,
                    status: status,
                    ticketId: ticketId
                });
            },
            postTicketReply: function(author, body, id) {
                return $http.post(API_URL + '/ticket/postTicketReply', {
                    author: author,
                    body: body,
                    id: id
                });
            },
            reopenTicket: function(id, status) {
                return $http.post(API_URL + '/ticket/reopenTicket', {
                    id: id,
                    status: status
                });
            },
            closeTicket: function(id, status) {
                return $http.post(API_URL + '/ticket/closeTicket', {
                    id: id,
                    status: status
                });
            }
        }
    });
})();