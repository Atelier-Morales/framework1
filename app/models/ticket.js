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
            createCategory: function() {
                return $http.post(API_URL + '/ticket/createCategory');
            }
        }
    });
})();