/*
 *  Project controller
 *  by Fernan Morales : fmorales@student.42.fr
 *
 */

(function() {
    var projectCtrl = angular.module('projectCtrl', [
        'userAuth',
        'projectModel',
    ]);
    
    projectCtrl.controller('projectCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        '$window',
        '$state',
        '$log',
        '$timeout',
        'userService', 
        'authService',
        'projectService',
        function projectCtrl($rootScope, $scope, $location, $window, $state, $log, $timeout, userService, authService, projectService) {
            
            function fetchProjects() {
                projectService.fetchProjects()
                .success(function(data){
                    console.log(data);
                    $scope.projects = data;
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            fetchProjects();
            
            $scope.createProject = function createProject(name, deadline, description) {
                projectService.createProject(name, deadline, description)
                .success(function(data) {
                    console.log(data);
                    fetchProjects();
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            $scope.setIndex = function(index) {
                $scope.index = index;
            }     
            
        }
    ]);
})();