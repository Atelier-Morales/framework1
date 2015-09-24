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
                return $http.post(API_URL + '/tickets/userTickets', {
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
            }
        }
    });
})();