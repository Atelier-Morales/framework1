/*
 *  User administration controller
 *  by Fernan Morales : fmorales@student.42.fr
 *
 */

(function () {
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
        '$http',
        '$cookies',
        'userService',
        'authService',
        function userMgmtCtrl($rootScope, $scope, $location, $window, $state, $log, $timeout, $http, $cookies, userService, authService) {
            $scope.usersCopy = null;
            $scope.subElem = 0;

            $scope.changeElement = function (index) {
                $scope.subElem = index;
            }

            $http.get('data/log.json').success(function (data) {
                $rootScope.logs = data;
            });

            function fetchUserInfos() {
                userService.fetchUserInfos()
                    .success(function (data) {
                        $scope.users = data;
                        $scope.usersCopy = angular.copy($scope.users);
                    })
                    .error(function (status, data) {
                        console.log(status);
                        console.log(data);
                        console.log('Could not fetch info');
                    });
            }

            fetchUserInfos();

            $scope.setIndex = function (index) {
                $scope.index = index;
            }
            
            $scope.clearLogs = function (index) {
                userService.clearLogs()
                .success(function(data) {
                    console.log('success');
                    $http.get('data/log.json').success(function (data) {
                        $rootScope.logs = data;
                    }); 
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not clear logs');
                });
            }

            $scope.logAs = function logAs(username) {
                if (username !== undefined) {
                    userService.logAs(username)
                        .success(function (data) {
                            $('#LogAsModal').foundation('reveal', 'close');
                            $log.log('User ' + username + ' successfully logged in');
                            $scope.authError = false;
                            $scope.regError = true;
                            authService.isLogged = true;
                            userService.verifyToken(data.token)
                                .success(function (data) {
                                    console.log('Fetched user info');
                                    $rootScope.userInfo = data;
                                    console.log($rootScope.userInfo);
                                })
                                .error(function (status, data) {
                                    console.log(status);
                                    console.log(data);
                                    console.log('Could not fetch info');
                                });
                            $window.sessionStorage.token = data.token;
                            $rootScope.logAs = true;
                            $cookies.put('logAs', true);
                            $window.sessionStorage.logAs = true;
                            console.log("API TOKEN = " + data.APIToken);
                            $window.sessionStorage.APIToken = data.APIToken;
                            $cookies.put('APIToken', data.APIToken);
                            $state.go('profile');
                        }).error(function (status, data) {
                            console.log(status);
                            console.log(data);
                            $scope.regError = true;
                            console.log("User not found");
                        });
                }
            }

            $scope.updateUser = function updateUser(username, oldUsername, email, role) {
                console.log(role);
                if (authService.isLogged && $window.sessionStorage.token) {
                    userService.updateUser(username, oldUsername, email, role)
                        .success(function (data) {
                            console.log('success');
                            $('#updateModal').foundation('reveal', 'close');
                            userService.verifyToken($window.sessionStorage.token)
                                .success(function (data) {
                                    $timeout(function () {
                                        $rootScope.userInfo = data;
                                        fetchUserInfos();
                                        console.log('fetched user infos');
                                    });
                                })
                                .error(function (status, data) {
                                    console.log(status);
                                    console.log(data);
                                    console.log('Could not fetch info');
                                });
                        })
                        .error(function (status, data) {
                            $log.log(status);
                            $log.log(data);
                        });
                } else {
                    console.log('Fail');
                    $('#updateModal').foundation('reveal', 'close');
                }
            }

            $scope.removeUser = function removeUser(username, is_admin) {
                if (is_admin === true)
                    window.alert('You cannot delete an admin!');
                else {
                    var confirm = window.confirm("Are you sure you want to delete the user " + username + "?");
                    if (confirm) {
                        console.log('yes');
                        userService.removeUser(username)
                            .success(function (data) {
                                fetchUserInfos();
                                console.log('User ' + username + ' deleted');
                                window.alert('User ' + username + ' deleted');
                            })
                            .error(function (status, data) {
                                $log.log(status);
                                $log.log(data);
                                window.alert('Failed at deleting user ' + username);
                            });
                    } else
                        console.log('nope');
                }

            }
        }
    ]);
})();