/*
 *  Admin login controller
 *  by Fernan Morales : fmorales@student.42.fr
 *
 */

(function () {
    var adminCtrl = angular.module('adminCtrl', [
        'userAuth',
        'ngCookies',
        'sidebarDirective',
        'pascalprecht.translate'
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
        '$translate',
        '$http',
        'userService',
        'authService',
        function AdminUserCtrl($rootScope, $scope, $location, $window, $state, $log, $cookies, $timeout, $translate, $http, userService, authService) {
            //Admin User Controller (login, logout)
            
            if ($window.sessionStorage.logAs === 'true') {
                console.log($window.sessionStorage.logAs);
                $rootScope.logAs = true;
            }
            else
                $rootScope.logAs = false;
            //console.log('log as scope '+$rootScope.logAs+' '+$window.sessionStorage.logAs);
            $scope.authError = false;
            $scope.regError = false;
            $scope.confirmAuth = false;
            var count = true;


            $scope.setIndex = function (index) {
                $scope.project = index;
            }
            
            $scope.getBareme = function (correction) {
                $http.get('data/baremes/'+correction.project+'.json').success(function(data) {
                    $timeout(function() {
                        $scope.bareme = data;
                        $scope.notation = [];
                        if (data[0].preliminary_show == true)
                            $scope.notation.push({question: "preliminary", grade:"none"});
                        for (var i = 0; i < data[0].questions.length; i++)
                            $scope.notation.push({question: i, grade:"none"});
                        if (data[0].bonus == true)
                            $scope.notation.push({question: "bonus", grade:0});
                    });
                });
            }
            
            $scope.setGrade = function (grade, index) {
                for (var i = 0; i < $scope.notation.length; i++) {
                    if ($scope.notation[i].question == index)
                        $scope.notation[i].grade = grade;
                }
            }
            
            $scope.verifyNotation = function () {
                if ($scope.notation != undefined) {
                    console.log($scope.notation.length);
                    for (var i = 0; i < $scope.notation.length; i++) {
                        if ($scope.notation[i].grade == "none") {
                            console.log("nope");
                            return false;
                        }
                    }
                    return true
                }
                return false;
            }

            $scope.isFailed = function (grade) {
                if (grade > 50)
                    return false;
                return true;
            }

            function isNumeric(num) {
                return !isNaN(num)
            }

            function setLanguage(user) {
                userService.getAndSetlanguage(user)
                    .success(function (data) {
                        $timeout(function () {
                            $translate.use(data);
                        });
                        return count;
                    })
                    .error(function (status, data) {
                        console.log(status + ' ' + data);
                        console.log('cannot set language');
                    });
            }
            
            $('.clickable').bind('click', function (ev) {
                var $div = $(ev.target);
                var offset = $div.offset();
                var x = ev.clientX - offset.left;
                $scope.$apply(function() {
                    // every changes goes here
                    var Value = (x/($('div.large-12').width()*0.66))*100;
                    console.log(Value);
                    if (Value < 10)
                        $scope.newValue = 0;
                    else if (Value > 10 && Value < 20)
                        $scope.newValue = 20;
                    else if (Value > 20 && Value < 40)
                        $scope.newValue = 40;
                    else if (Value > 40 && Value < 60)
                        $scope.newValue = 60;
                    else if (Value > 60 && Value < 80)
                        $scope.newValue = 80;
                    else if (Value > 80)
                        $scope.newValue = 100;
                });

                $('.meter').width($scope.newValue+'%');
            });
            
            $scope.setWidth = function (index) {
                var $div = $(event.target);
                var offset = $div.offset();
                var x = event.clientX - offset.left;
                var Value = (x/($('div.large-12').width()*0.66))*100;
                if (Value < 10)
                    Value = 0;
                else if (Value > 10 && Value < 20)
                    Value = 20;
                else if (Value > 20 && Value < 40)
                    Value = 40;
                else if (Value > 40 && Value < 60)
                    Value = 60;
                else if (Value > 60 && Value < 80)
                    Value = 80;
                else if (Value > 80)
                    Value = 100;
                $scope.questions[index].value = Value;
                console.log($scope.questions[index].value)
                $('.elem'+index).width(Value+'%');
            }
            
            $rootScope.$watch('userInfo', function () {
                if ($rootScope.userInfo === undefined || $rootScope.userInfo === null || $rootScope.userInfo === "")
                    return;
                console.log($rootScope.userInfo.lang);
                if ($rootScope.userInfo.lang != 'eng')
                    setLanguage($rootScope.userInfo.username);
            });

            $scope.changeInitLanguage = function (lang) {
                $translate.use(lang);
            }

            $scope.changeLanguage = function (user, lang) {
                $translate.use(lang);
                userService.changeLanguage(user, lang)
                    .success(function (data) {
                        console.log('language switched to ' + data);
                    })
                    .error(function (status, data) {
                        console.log(status);
                        console.log(data);
                        console.log('Couldn\'t change language');
                    });
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

            $(window).resize(function () {
                sideNav();
            });

            $scope.grade_is_valid = function (grade) {
                if (grade != undefined && isNumeric(grade) && grade <= 100 && grade >= 0) {
                    return true;
                }
                return false;
            }

            $scope.logIn = function logIn(username, password) {
                if (username !== undefined && password !== undefined) {
                    userService.logIn(username, password)
                        .success(function (data) {
                            $('#myModal').foundation('reveal', 'close');
                            $log.log('User ' + username + ' successfully logged in');
                            $scope.authError = false;
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
                            $cookies.put('token', data.token);
                            console.log("API TOKEN = " + data.APIToken);
                            $window.sessionStorage.APIToken = data.APIToken;
                            $cookies.put('APIToken', data.APIToken);
                            $state.go('dashboard');
                        }).error(function (status, data) {
                            console.log(status);
                            console.log(data);
                            console.log("User not found. Trying with LDAP login...");
                            userService.logInLDAP(username, password).success(function (data) {
                                $('#myModal').foundation('reveal', 'close');
                                $log.log('User ' + username + ' successfully logged in with LDAP');
                                $scope.authError = false;
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
                                $cookies.put('token', data.token);
                                console.log("API TOKEN = " + data.APIToken);
                                $window.sessionStorage.APIToken = data.APIToken;
                                $cookies.put('APIToken', data.APIToken);
                                $state.go('dashboard');
                            }).error(function (status, data) {
                                console.log(status);
                                console.log(data);
                                $scope.authError = true;
                            });
                        });
                }
            }

            $scope.logOut = function logOut() {
                if (authService.isLogged && $window.sessionStorage.token) {
                    userService.logOut($rootScope.userInfo.username, $window.sessionStorage.token)
                        .success(function (data) {
                            authService.isLogged = false;
                            $cookies.remove('token');
                            delete $window.sessionStorage.token;

                            $state.go('home');
                        })
                        .error(function (status, data) {
                            $log.log(status);
                            $log.log(data);
                        });
                } else {
                    console.log('test');
                    $state.go('home');
                }
            }

            $scope.ExitLogAs = function ExitLogAs() {
                var token = $cookies.get('token');
                userService.verifyToken(token)
                    .success(function (data) {
                        $timeout(function () {
                            $rootScope.userInfo = data;
                        });
                        console.log('Log as exited. Redirecting...');
                        $window.sessionStorage.token = token;
                        $window.sessionStorage.logAs = false;
                        $rootScope.logAs = false;
                        $cookies.put('logAs', false);
                        userService.removeLoggedAs()
                        .success(function() {
                            console.log('logged as users removed');
                        })
                        .error(function(status, data) {
                            console.log(status);
                            console.log(data);
                            console.log('could not remove logged as users');
                            
                        });
                        $state.go('users');
                    })
                    .error(function (status, data) {
                        console.log(status);
                        console.log(data);
                    });
            }

            $scope.register = function register(username, email, password, passwordConfirm) {
                if (authService.isLogged) {
                    $('#myModal2').foundation('reveal', 'close');
                    $log.log('User already registered');
                    $state.go('dashboard');
                } else {
                    userService.register(username, email, password, passwordConfirm).success(function (data) {
                        $log.log('user successfully registered');
                        $scope.confirmAuth = true;
                        $('#myModal2').foundation('reveal', 'close');
                        $('#myModal').foundation('reveal', 'open');
                    }).error(function (status, data) {
                        console.log(status);
                        console.log(data);
                        $log.log('Registration failed!');
                        $scope.regError = true;
                    });
                }
            }

            $scope.setAsFinished = function setAsFinished(name, username) {
                var confirm = window.confirm("Are you sure you've finished the project " + name + "?");
                if (confirm) {
                    console.log('yes');
                    userService.completeProject(name, username)
                        .success(function (data) {
                            window.alert('Project Finished!');
                            userService.verifyToken($cookies.get('token'))
                                .success(function (data) {
                                    $timeout(function () {
                                        $rootScope.userInfo = data;
                                    });
                                })
                                .error(function (status, data) {
                                    console.log(status);
                                    console.log(data);
                                });
                        })
                        .error(function (status, data) {
                            $log.log(status);
                            $log.log(data);
                            window.alert('Error: Could not set project as finished');
                        });
                } else
                    console.log('nope');
            }

            $scope.sendEmail = function sendEmail(sender, subject, text) {
                userService.sendEmail(sender, subject, text)
                    .success(function (data) {
                        console.log('email sent');
                        window.alert('Thanks for contact us');
                    })
                    .error(function (status, data) {
                        console.log(status);
                        console.log(data);
                    });
            }
        }
    ]);
})();