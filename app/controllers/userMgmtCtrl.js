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
                    console.log('fruvf'+$scope.usersCopy)
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
        }
    ]);
})();