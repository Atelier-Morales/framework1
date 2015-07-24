
/* global angular */

/**
 * Basic directives for content display
 * @author Fernan Morales <fmorales@student.42.fr>
 */

(function() {
    var app = angular.module('sidebarDirective', []);
    
    app.directive('sidebarUser', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/sidebarUser.html'
        }
    });
    
    app.directive('sidebarAdmin', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/sidebarAdmin.html'
        }
    });
})();