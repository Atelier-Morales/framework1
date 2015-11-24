/*
 *  All user profiles controller
 *  by Fernan Morales : fmorales@student.42.fr
 *
 */

(function() {
    var profilesCtrl = angular.module('profilesCtrl', [
        'userAuth',
        'ngCookies'
    ]);
    
    profilesCtrl.controller('ProfilesCtrl', [
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
        function ProfilesCtrl($rootScope, $scope, $location, $window, $state, $log, $cookies, $timeout, $translate, userService, authService) {
            
            $scope.grade = 0;
            $scope.isLoaded = false;

            function fetchUsersLDAP() {
                userService.fetchUsersLDAP()
                .success(function(data) {
                    console.log("success");
                    $scope.profiles = data;
                    $scope.isLoaded = true;
                    len = $scope.profiles.length;
                    $log.log(len);
                    $scope.quantity = 10;
                    $scope.loadMore = function() {
                            var last = $scope.profiles[$scope.profiles.length - 1];
                            for(var i = 1; i <= 10; i++) {
                                    $scope.profiles.push(last + i);
                                    $scope.quantity += 1;
                            }
                    }
                })
                .error(function(status, data) {
                    $log.log(status);
                    $log.log(data);
                    $scope.profiles = $rootScope.userInfo;
                    $scope.isLoaded = true;
                });
            }

            $scope.greaterThan = function(prop){
                return function(item){
                    if ($scope.grade === 'fail')
                        return item[prop] < 80;
                    else
                        return item[prop] > $scope.grade;
                }
            }
            
            $scope.setGrade = function(grade) {
                $scope.grade = grade;
            }
            
            

            $rootScope.$watch('userInfo', function () {
                if ($rootScope.userInfo === undefined || $rootScope.userInfo === null || $rootScope.userInfo === ""
                   || $scope.profiles != undefined || $scope.profiles != null)
                    return;
                fetchUsersLDAP();
            });

        }
    ]);
})();