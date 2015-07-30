
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
                return $http.post(API_URL + '/project/createProject', { 
                    name: name, 
                    deadline: deadline,
                    description: description
                });
            },
            fetchProjects: function(username) {
                return $http.post(API_URL + '/project/fetchProjects', {
                    username: username
                });
            },
            deleteProject: function(name) {
                return $http.post(API_URL + '/project/deleteProject', {
                    name: name
                });
            },
            registerProject: function(name, username, deadline) {
                return $http.post(API_URL + '/user/registerProject', {
                    name: name,
                    username: username,
                    deadline: deadline
                });
            },
            updateProject: function(name, oldname, deadline, description) {
                return $http.post(API_URL + '/project/updateProject', {
                    name: name,
                    oldname: oldname,
                    deadline: deadline,
                    description: description
                });
            }
        }
    });
})();
