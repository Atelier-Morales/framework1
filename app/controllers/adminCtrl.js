/*
 *  Admin login controller
 *  by Fernan Morales : fmorales@student.42.fr
 *
 */

(function() {
    var adminCtrl = angular.module('adminCtrl', [
        'userAuth',
        'ngCookies'
    ]);
    
    adminCtrl.controller('AdminUserCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        '$window',
        '$state',
        '$log',
        '$cookies',
        'userService', 
        'authService',
        function AdminUserCtrl($rootScope, $scope, $location, $window, $state, $log, $cookies, userService, authService) {
            //Admin User Controller (login, logout)
            
            $scope.authError = false;
            $scope.regError = false;
            $scope.confirmAuth = false;
            
            /*$rootScope.$on('logged_in', function(ev, user) {
                
                authService.isLogged = true;
                $scope.$apply(function () {
                    $scope.userInfo = user;
                });
                authService.userInfo = user;
                console.log('BITCH');
                console.log($scope.userInfo);
            });
            
            $scope.userInfo = {};*/
            
            //sidenav resize
            function sideNav() {
              if ($(window).width() < 769) {
                $('.off-canvas-wrap').removeClass('move-right');
                $('.left-off-canvas-toggle').show();
              } else {
                $('.off-canvas-wrap').addClass('move-right');
                $('.left-off-canvas-toggle').hide();
              }  
            }

            $(window).resize(function() {
                sideNav();
            });

            
            $scope.logIn = function logIn(username, password) {
                if (username !== undefined && password !== undefined) {
                    userService.logIn(username, password).success(function(data) {
                        $('#myModal').foundation('reveal', 'close');
                        $log.log('User '+username+' successfully logged in');
                        $scope.authError = false;
                        authService.isLogged = true;
                        userService.verifyToken(data.token)
                        .success(function(data) {
                            console.log('Fetched user info');
                            $rootScope.userInfo = data;
                            console.log($rootScope.userInfo);
                        })
                        .error(function(status, data) {
                            console.log(status);
                            console.log(data);
                            console.log('Could not fetch info');
                        });
                        $window.sessionStorage.token = data.token;
                        $cookies.put('token', data.token);
                        $state.go('dashboard');
                    }).error(function(status, data) {
                        console.log(status);
                        console.log(data);
                        $scope.authError = true;
                    });
                }
            }
                
            $scope.logOut = function logOut() {
                if (authService.isLogged && $window.sessionStorage.token) {
                    userService.logOut($window.sessionStorage.token).success(function(data) {
                        authService.isLogged = false;
                        $cookies.remove('token');
                        delete $window.sessionStorage.token;
                        
                        $state.go('home');
                    })
                    .error(function(status, data) {
                        $log.log(status);
                        $log.log(data);
                    });
                }
                else {
                    console.log('test');
                    $state.go('home');
                }
            }
            
            $scope.register = function register(username, email, password, passwordConfirm) {
                if (authService.isLogged) {
                    $('#myModal2').foundation('reveal', 'close');
                    $log.log('User already registered');
                    $state.go('dashboard');
                }
                else {
                    userService.register(username, email, password, passwordConfirm).success(function(data) {
                        $log.log('user successfully registered');
                        $scope.confirmAuth = true;
                        $('#myModal2').foundation('reveal', 'close');
                        $('#myModal').foundation('reveal', 'open');
                    }).error(function(status, data) {
                        console.log(status);
                        console.log(data);
                        $log.log('Registration failed!');
                        $scope.regError = true;
                    });
                }
            }
        }
    ]);
})();