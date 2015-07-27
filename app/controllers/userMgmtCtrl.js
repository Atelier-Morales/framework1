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
            
            $scope.setIndex = function(index) {
                $scope.index = index;
                console.log($scope.index);
            }
            
            $scope.updateUser = function updateUser(username, email, role) {
                if (authService.isLogged && $window.sessionStorage.token) {
                    userService.updateUser(username, email, role)
                    .success(function(data) {
                        console.log('success');
                        $('#updateModal').foundation('reveal', 'close');
                    })
                    .error(function(status, data) {
                        $log.log(status);
                        $log.log(data);
                        /*authService.isLogged = false;
                        $cookies.remove('token');
                        delete $window.sessionStorage.token;
                        $state.go('home');*/
                    });
                }
                else {
                    console.log('Failed test');
                    //$state.go('home');
                }
            }
        }
    ]);
})();