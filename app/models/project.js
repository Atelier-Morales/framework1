
/* global angular */

/**
 * Angular services of project management
 * @author Fernan Morales <fmorales@student.42.fr>
 */

(function() {
    var project = angular.module("projectModel", []);
    
    project.factory('projectService', function($http) {
        return {
            createProject : function(name, deadline, description) {
                return $http.post(API_URL + '/project/createProject', 
                { 
                    name: name, 
                    deadline: deadline,
                    description: description
                });
            },
            fetchProjects: function() {
                return $http.get(API_URL + '/project/fetchProjects');
            }
        }
    });
})();
