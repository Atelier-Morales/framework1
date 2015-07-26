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
            userService.fetchUserInfos()
            .success(function(data){
                $scope.users = data;
                console.log($scope.users)
            })
            .error(function(status, data) {
                console.log(status);
                console.log(data);
                console.log('Could not fetch info');
            });
        }
    ]);
})();