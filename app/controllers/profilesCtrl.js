/*
 *  All user profiles controller
 *  by Fernan Morales : fmorales@student.42.fr
 *
 */

(function() {
    var profilesCtrl = angular.module('profilesCtrl', [
        'userAuth',
        'ngCookies',
        'angular-advanced-searchbox',
        'infinite-scroll'
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
        '$stateParams',
        '$q',
        'userService', 
        'authService',
        function ProfilesCtrl($rootScope, $scope, $location, $window, $state, $log, $cookies, $timeout, $translate, $stateParams, $q, userService, authService) {

            $scope.grade = 0;
            $scope.search = "";
            function fetchAPIusers() {
                var token = $cookies.get('APIToken');
                $scope.token = token;
                if ($scope.isLoaded === false) {
                    userService.fetchAPIusers(token)
                    .success(function(data) {
                        console.log("success");
                        $scope.profiles = data;
                        $scope.isLoaded = true;
                        $scope.currentCursus = '42';
                    })
                    .error(function(status, data) {
                        $log.log(status);
                        $log.log(data);
                        $scope.profiles = $rootScope.userInfo;
                        $scope.isLoaded = true;
                    });
                }
            }
            
            function fetchCampus() {
                var token = $cookies.get('APIToken');
                $scope.token = token;
                userService.fetchCampus(token)
                .success(function(data) {
                    console.log("campus success");
                    $scope.campus = data;
                })
                .error(function(status, data) {
                    $log.log(status);
                    $log.log(data);
                });
            }
            
            $scope.availableSearchParams = [
              { key: "login", name: "login", placeholder: "login..." },
              { key: "campus", name: "campus", placeholder: "campus..." },
              { key: "cursus", name: "cursus", placeholder: "cursus..." }
            ];
            
            function fetchCursus() {
                var token = $cookies.get('APIToken');
                $scope.token = token;
                userService.fetchCursus(token)
                .success(function(data) {
                    console.log("cursus success");
                    $scope.cursus = data;
                })
                .error(function(status, data) {
                    $log.log(status);
                    $log.log(data);
                });
            }
            
            $scope.loadMore = function() {
                if ($scope.currentPage === undefined)
                    $scope.currentPage = 1;
                $scope.currentPage += 1;
                console.log($scope.currentPage);
                userService.loadMoreUsers($scope.token, $scope.currentCursus, $scope.currentPage)
                .success(function(data) {
                    console.log("success");
                    for (var i = 0; i < data.length; i++) {
                        $scope.profiles.push(data[i]);
                    }
                })
                .error(function(status, data) {
                    $log.log(status);
                    $log.log(data);
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
                   || $state.is('profiles.user'))
                    return;
                if ($scope.isLoaded === undefined) {
                    $scope.isLoaded = false;
                    fetchAPIusers();
                    fetchCampus();
                    fetchCursus();
                }
            });
            
            
            $rootScope.$on("$stateChangeStart", function(e, toState, toParams, fromState, fromParams) {
                if ($scope.isLoaded2 === true && fromState.name === "profiles.user") {
                    $scope.isLoaded2 = undefined;
                    $scope.profile = undefined;
                }
                var username = toParams.id;
                if (toState.name === 'profiles.user' &&  $scope.isLoaded2 === undefined) {
                    $scope.isLoaded2 = false;
                    userService.fetchAPIinfo($scope.token, username)
                    .success(function(data) {
                        console.log("success1");
                        $scope.isLoaded2 = true;
                        $scope.profile = data;
                        $scope.picture = "https://cdn.intra.42.fr/userprofil/"+data.login+".jpg";
                        $scope.ldap = true;      
                    })
                    .error(function(status, data) {
                        $log.log(status);
                        $log.log(data);
                        $scope.profile = $rootScope.userInfo;
                        $scope.ldap = false;
                        $scope.isLoaded2 = true;
                    });
                }
            });
        }
    ]);
})();