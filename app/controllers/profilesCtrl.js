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
            $scope.currentCursus = '42';
            function fetchAPIusers() {
                var token = $cookies.get('APIToken');
                $scope.token = token;
                if ($scope.isLoaded === false) {
                    userService.fetchAPIusers(token)
                    .success(function(data) {
                        console.log("success");
                        $scope.profiles = data;
                        $scope.isLoaded = true;
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
                    $scope.campus = data;
                })
                .error(function(status, data) {
                    $log.log(status);
                    $log.log(data);
                });
            }
            
//            $scope.availableSearchParams = [
//              { key: "login", name: "login", placeholder: "login..." },
//              { key: "campus", name: "campus", placeholder: "campus..." },
//              { key: "cursus", name: "cursus", placeholder: "cursus..." }
//            ];
            
            $scope.closeAlert = function() {
                $('.alert-box').hide();
            }
            
            function fetchCursus() {
                var token = $cookies.get('APIToken');
                $scope.token = token;
                userService.fetchCursus(token)
                .success(function(data) {
                    $scope.cursus = data;
                })
                .error(function(status, data) {
                    $log.log(status);
                    $log.log(data);
                });
            }
            
            $scope.getCursusUsers = function(cursus) {
                $('input.search-parameter-input').val('');
                $scope.currentPage = 1;
                console.log(cursus);
                $scope.currentCursus = cursus;
                var token = $cookies.get('APIToken');
                $scope.isLoaded = false;
                userService.fetchCursusUsers(token, cursus)
                .success(function(data) {
                    console.log("success cursus");
                    $scope.isLoaded = true;
                    $scope.profiles = data;
                })
                .error(function(status, data) {
                    $log.log(status);
                    $log.log(data);
                    $scope.isLoaded = true;
                    
                });
            }
            
            $timeout(function() {
                $scope.loadMore = function() {
                    if ($scope.currentPage === undefined)
                        $scope.currentPage = 1;
                    $scope.currentPage += 1;
                    console.log($scope.currentPage);
                    if ($scope.profiles != undefined) {
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
                }
            });

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
            
            var unregister = $rootScope.$watch('userInfo', function () {
                if ($rootScope.userInfo === undefined || $rootScope.userInfo === null || $rootScope.userInfo === ""
                   || $state.is('profiles.user'))
                    return;
                if ($scope.isLoaded === undefined) {
                    $scope.isLoaded = false;
                    fetchAPIusers();
                    fetchCampus();
                    fetchCursus();
                }
                unregister();
            });
            
            $timeout(function() {
                $scope.$watch('search', function() {
                    if ($scope.search === undefined || Object.keys($scope.search).length === 0
                       || $state.is('profiles.user'))
                        return;
                    $('.alert-box').hide();
                    $scope.isLoaded = false;
                    $scope.profiles = [];
                    $('input[data-toggle]').attr('checked', false);
                    var username = $scope.search.query;
                    userService.fetchAPIinfo($scope.token, username)
                    .success(function(data) {
                        $scope.isLoaded = true;
                        $scope.profiles.push({"login": data.login});     
                    })
                    .error(function(status, data) {
                        $log.log(status);
                        $log.log(data);
                        $('.alert-box').show();
                        $scope.isLoaded= true;
                    });
                });
            });
            
            $rootScope.$on("$stateChangeStart", function(e, toState, toParams, fromState, fromParams) {
                if ($scope.isLoaded2 === true && fromState.name === "profiles.user") {
                    $scope.isLoaded2 = undefined;
                    $scope.isLoaded = undefined;
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