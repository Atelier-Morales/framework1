/*
 *  Project controller
 *  by Fernan Morales : fmorales@student.42.fr
 *
 */

(function() {
    var projectCtrl = angular.module('projectCtrl', [
        'userAuth',
        'projectModel',
        'angularMoment'
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
        'moment',
        function projectCtrl($rootScope, $scope, $location, $window, $state, $log, $timeout, userService, authService, projectService, moment) {
            
            var username = '';
            var count2 = 0;
            $scope.regError = false;
            
            var start = moment().format('YYYY-MM-DD');
            var end = moment("2016-12-31", "YYYY-MM-DD");
            $scope.date = moment.range(start, end);
            
            $scope.acc = [];

            $scope.date.by('days', function(moment) {
                $scope.acc.push(moment.format('YYYY-MM-DD'));
            });
            
            var count = 0;
            $scope.months = [];
            while (count < 12) 
                $scope.months.push(moment().month(count++).format("MMMM"));
            
            var count = 0;
            $scope.days = [];
            while (count < 31) 
                $scope.days.push(moment().day(count++).format("DD"));
            $scope.days.sort(); 
            
            $scope.years = ['2015', '2016'];
            
            function fetchProjects(username) {
                projectService.fetchProjects(username)
                .success(function(data){
                    console.log(data);
                    $scope.projects = data;
                    $scope.projectsCopy = angular.copy($scope.projects);
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            $scope.setUsername = function(name) {
                if (name != undefined) {
                    if (count2 === 0) {
                        $scope.username = angular.copy(name);
                        fetchProjects($scope.username);
                        count2++
                    }
                    
                }
            }
    
            $scope.date_is_invalid = function(year, month, day){
                var cust = year+"-"+month+"-"+day;
                var cust2 = moment(cust).format("YYYY-MM-DD");
                var when  = moment(cust, "YYYY-MM-DD");
                if (cust2 > moment().format("YYYY-MM-DD")) {
                    return true;
                }
                else
                    return false;
            }
            
            $scope.createProject = function createProject(name, deadline, description) {
                var date = deadline.year+"-"+deadline.month+"-"+deadline.day;
                projectService.createProject(name, date, description)
                .success(function(data) {
                    console.log(data);
                    $('#projectModal').foundation('reveal', 'close');
                    fetchProjects($scope.username);
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                    $scope.regError = true;
                });
            }
            
            $scope.setIndex = function(index) {
                $scope.index = index;
            }
            
            $scope.deleteProject = function deleteProject(name) {
                var confirm = window.confirm("Are you sure you want to delete the project "+name+"?");
                if (confirm ) {
                    console.log('yes');
                    projectService.deleteProject(name)
                    .success(function(data) {
                        fetchProjects($scope.username);
                        console.log('Project '+name+' deleted');
                        window.alert('Project '+name+' deleted');
                    })
                    .error(function(status, data) {
                        $log.log(status);
                        $log.log(data);
                        window.alert('Failed at deleting project '+name);
                    });         
                }
                else
                    console.log('nope');        
            }
            
            $scope.updateProject = function updateProject(name, oldname, deadline, description) {
                var date = deadline.year+"-"+deadline.month+"-"+deadline.day;
                projectService.updateProject(name, oldname, date, description)
                .success(function(data) {
                    console.log(data);
                    $('#updateProjectModal').foundation('reveal', 'close');
                    window.alert('Project '+oldname+' updated!');
                    fetchProjects($scope.username);
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not update project');
                    $scope.regError = true;
                });
            }
            
            $scope.registerProject = function registerProject(name, username, deadline) {
                var confirm = window.confirm("Are you sure you want to do the project "+name+"?");
                if (confirm ) {
                    console.log('yes');
                    projectService.registerProject(name, username, deadline)
                    .success(function(data) {
                        fetchProjects($scope.username);
                        console.log('Registered to project '+name);
                        window.alert('Registered to project '+name);
                    })
                    .error(function(status, data) {
                        $log.log(status);
                        $log.log(data);
                        window.alert('Could not register to project '+name);
                    });         
                }
                else
                    console.log('nope');        
            }
            
        }
    ]);
})();