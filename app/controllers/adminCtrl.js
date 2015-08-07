/*
 *  Admin login controller
 *  by Fernan Morales : fmorales@student.42.fr
 *
 */

(function() {
    var adminCtrl = angular.module('adminCtrl', [
        'userAuth',
        'ngCookies',
        'sidebarDirective'
    ]);
    
    adminCtrl.controller('AdminUserCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        '$window',
        '$state',
        '$log',
        '$cookies',
        '$timeout',
        'userService', 
        'authService',
        function AdminUserCtrl($rootScope, $scope, $location, $window, $state, $log, $cookies, $timeout, userService, authService) {
            //Admin User Controller (login, logout)
            
            $scope.authError = false;
            $scope.regError = false;
            $scope.confirmAuth = false;
            
            
            $scope.setIndex = function(index) {
                $scope.project = index;
            }
            
            $scope.isFailed = function(grade) {
                if (grade > 50)
                    return false;
                return true;
            }
            
            function isNumeric(num){
                return !isNaN(num)
            }
            
            //sidenav resize
            function sideNav() {
              if ($(window).width() < 769) {
                $('.off-canvas-wrap').removeClass('move-right');
                $('.left-off-canvas-toggle').show();
              } else {
                $('.off-canvas-wrap').addClass('move-right');
                $('.left-off-canvas-toggle').hide();
              }
              $(document).foundation();
            }

            $(window).resize(function() {
                sideNav();
            });
            
            $scope.grade_is_valid = function(grade){
                if (grade != undefined && isNumeric(grade) && grade <= 100 && grade >= 0) {
                    return true;
                }
                return false;
            }
            
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
                        console.log("User not found. Trying with LDAP login...");
                        userService.logInLDAP(username, password).success(function(data) {
                            $('#myModal').foundation('reveal', 'close');
                            $log.log('User '+username+' successfully logged in with LDAP');
                            $scope.authError = false;
                            authService.isLogged = true;
                            userService.verifyTokenLDAP(data.token)
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
                    });
                }
            }
                
            $scope.logOut = function logOut() {
                if (authService.isLogged && $window.sessionStorage.token) {
                    userService.logOut($window.sessionStorage.token)
                    .success(function(data) {
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
            
            $scope.setAsFinished = function setAsFinished(name, username, grade) {
                var confirm = window.confirm("Are you sure you've finished the project "+name+"?");
                if (confirm) {
                    console.log('yes');
                    userService.completeProject(name, username, grade)
                    .success(function(data) {
                        $log.log(data);
                        $('#finishProjectModal').foundation('reveal', 'close');
                        window.alert('Project Finished!');
                        console.log($window.sessionStorage.token);
                        userService.verifyToken($cookies.get('token'))
                        .success(function(data) {
                            $timeout(function() {
                                $rootScope.userInfo = data;
                            });
                        })
                        .error(function(status, data) {
                            console.log(status);
                            console.log(data);
                        });
                    })
                    .error(function(status, data) {
                        $log.log(status);
                        $log.log(data);
                        window.alert('Error: Could not set project as finished'); 
                        $('#finishProjectModal').foundation('reveal', 'close');
                    });
                }
                else
                    console.log('nope');
            }
            
            $scope.sendEmail = function sendEmail(sender, subject, text) {
                userService.sendEmail(sender, subject, text)
                .success(function(data) {
                    console.log('email sent');
                    window.alert('Thanks for contact us');
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }
        }
    ]);
})();