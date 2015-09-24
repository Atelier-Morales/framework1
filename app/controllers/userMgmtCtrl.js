/*
 *  User administration controller
 *  by Fernan Morales : fmorales@student.42.fr
 *
 */

(function() {
    var userMgmtCtrl = angular.module('userMgmtCtrl', [
        'userAuth',
    ]);
    
    userMgmtCtrl.controller('userMgmtCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        '$window',
        '$state',
        '$log',
        '$timeout',
        'userService', 
        'authService',
        function userMgmtCtrl($rootScope, $scope, $location, $window, $state, $log, $timeout, userService, authService) {
            $scope.usersCopy = null;
            
            function fetchUserInfos() {
                userService.fetchUserInfos()
                .success(function(data){
                    $scope.users = data;
                    $scope.usersCopy = angular.copy($scope.users);
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            fetchUserInfos();
            
            $scope.setIndex = function(index) {
                $scope.index = index;
            }
            
            $scope.updateUser = function updateUser(username, oldUsername, email, role) {
                console.log(role);
                if (authService.isLogged && $window.sessionStorage.token) {
                    userService.updateUser(username, oldUsername, email, role)
                    .success(function(data) {
                        console.log('success');
                        $('#updateModal').foundation('reveal', 'close');
                        userService.verifyToken($window.sessionStorage.token)
                        .success(function(data) {
                            $timeout(function() {
                                $rootScope.userInfo = data;
                                fetchUserInfos();
                                console.log('fetched user infos');
                            });
                        })
                        .error(function(status, data) {
                            console.log(status);
                            console.log(data);
                            console.log('Could not fetch info');
                        });
                    })
                    .error(function(status, data) {
                        $log.log(status);
                        $log.log(data);
                    });
                }
                else {
                    console.log('Fail');
                    $('#updateModal').foundation('reveal', 'close');
                }
            }
            
            $scope.removeUser = function removeUser(username, is_admin) {
                if (is_admin === true)
                    window.alert('You cannot delete an admin!');
                else {
                    var confirm = window.confirm("Are you sure you want to delete the user "+username+"?");
                    if (confirm ) {
                        console.log('yes');
                        userService.removeUser(username)
                        .success(function(data) {
                            fetchUserInfos();
                            console.log('User '+username+' deleted');
                            window.alert('User '+username+' deleted');
                        })
                        .error(function(status, data) {
                            $log.log(status);
                            $log.log(data);
                            window.alert('Failed at deleting user '+username);
                        });         
                    }
                    else
                        console.log('nope');
                }
                    
            }
        }
    ]);
})();