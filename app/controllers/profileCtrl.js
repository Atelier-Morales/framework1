/*
 *  user profile controller
 *  by Fernan Morales : fmorales@student.42.fr
 *
 */

(function() {
    var profileCtrl = angular.module('profileCtrl', [
        'userAuth',
        'ngCookies'
    ]);
    
    profileCtrl.controller('UserProfileCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        '$window',
        '$state',
        '$log',
        '$cookies',
        '$timeout',
        '$translate',
        'userService', 
        'authService',
        function UserProfileCtrl($rootScope, $scope, $location, $window, $state, $log, $cookies, $timeout, $translate, userService, authService) {
            
            function fetchAPIinfo(username) {
                var token = $cookies.get('APIToken');
                $scope.token = token;
                userService.fetchAPIinfo(token, username)
                .success(function(data) {
                    console.log("success");
                    $scope.profile = data;
                    $scope.picture = "https://cdn.intra.42.fr/userprofil/"+data.login+".jpg";
                    $scope.ldap = true;
                })
                .error(function(status, data) {
                    $log.log(status);
                    $log.log(data);
                    $scope.profile = $rootScope.userInfo;
                    $scope.ldap = false;
                });
            }
            
            $rootScope.$watch('userInfo', function () {
                if ($rootScope.userInfo === undefined || $rootScope.userInfo === null || $rootScope.userInfo === "")
                    return;
                fetchAPIinfo($rootScope.userInfo.username);
            })
        }
    ]);
})();