(function() {
    if (window.location.protocol === "https:")
        API_URL = "https://localhost:8002";
    else
        API_URL = "http://localhost:8001";
    
    var app = angular.module('homepage', [
        'adminCtrl',
        'projectCtrl',
        'userMgmtCtrl',
        'forumCtrl',
        'userAuth',
        'projectModel',
        'ui.router',
        'ngCookies'
    ]);
    
    app.config(function($stateProvider, $urlRouterProvider, $locationProvider){
 
        $urlRouterProvider.otherwise('/home');

        $stateProvider
        .state('home',{
            url: '/home',
            views: {
                'menu': {
                    templateUrl: '/templates/menu.html',
                    controller: 'AdminUserCtrl'
                },
                'content': {
                    templateUrl: '/templates/content.html',
                    controller: 'AdminUserCtrl'
                },
                'footer': {
                    templateUrl: '/templates/footer.html',
                    controller: 'AdminUserCtrl',
                }
            }
        })
        .state('dashboard', {
            url: '/dashboard',
            views: {
                'menu': {
                    templateUrl: '/templates/menuLogged.html',
                    controller: 'AdminUserCtrl'
                },
                'content': {
                    templateUrl: '/templates/adminView.html',
                    controller: 'AdminUserCtrl'
                }
            }

        })
        .state('users', {
            url: '/users',
            views: {
                'menu': {
                    templateUrl: '/templates/menuLogged.html',
                    controller: 'AdminUserCtrl'
                },
                'content': {
                    templateUrl: '/templates/usersView.html',
                    controller: 'userMgmtCtrl'
                }
            }
        })
        .state('projects', {
            url: '/projects',
            views: {
                'menu': {
                    templateUrl: '/templates/menuLogged.html',
                    controller: 'AdminUserCtrl'
                },
                'content': {
                    templateUrl: '/templates/projects.html',
                    controller: 'projectCtrl'
                }
            }
        })
        .state('forum', {
            url: '/forum',
            views: {
                'menu': {
                    templateUrl: '/templates/menuLogged.html',
                    controller: 'AdminUserCtrl'
                },
                'content': {
                    templateUrl: '/templates/forum.html',
                    controller: 'forumCtrl'
                }
            }
        })
        .state('forbidden', {
            url: '/403',
            views: {
                'menu': {
                    templateUrl: '/templates/menuLogged.html',
                    controller: 'AdminUserCtrl'
                },
                'content': {
                    templateUrl: '/templates/403.html',
                    controller: 'AdminUserCtrl'
                }
            }
        })
        
        $locationProvider.html5Mode(true);
    });
    
    app.run(function($rootScope, $state, $window, $cookies, $timeout, authService, userService) {
        $rootScope.$on("$stateChangeStart", function(e, toState, toParams, fromState, fromParams) {
            console.log($window.sessionStorage.token);
            var token = $cookies.get('token');
            
            if (toState.name.indexOf('home') > -1 && !$window.sessionStorage.token && fromState.name === "") {
                if (token === undefined)
                    console.log('Welcome to the intranet!');
                else {
                    userService.verifyToken(token)
                    .success(function(data) {
                        $timeout(function() {
                            $rootScope.userInfo = data;
                        });
                        console.log('1: User already logged in. Redirecting...');
                        $window.sessionStorage.token = token;
                        e.preventDefault();
                        $state.go('dashboard');
                    })
                    .error(function(status, data) {
                        console.log(status);
                        console.log(data);
                    });
                }
            }
            if ((toState.name.indexOf('dashboard') > -1 ||
                 toState.name.indexOf('users') > -1     ||
                 toState.name.indexOf('forbidden') > -1 ||
                 toState.name.indexOf('projects') > -1)
                 && !$window.sessionStorage.token) {
                // If logged out and transitioning to a logged in page:
                if (token === undefined) {
                    e.preventDefault();
                    $state.go('home');
                }
                else {
                    userService.verifyToken(token)
                    .success(function(data) {
                        $timeout(function() {
                            $rootScope.userInfo = data;
                        });
                        console.log($rootScope.userInfo);
                        console.log('2: User already logged in...');
                        $window.sessionStorage.token = token;
                    })
                    .error(function(status, data) {
                        console.log(status);
                        console.log(data);
                        e.preventDefault();
                        $state.go('home');
                    });
                } 
            }
            if (toState.name.indexOf('home') > -1 && $window.sessionStorage.token) {
                // If logged in and transitioning to a logged out page:
                userService.verifyToken(token)
                .success(function(data) {
                    $timeout(function() {
                        $rootScope.userInfo = data;
                    });
                    authService.isLogged = true;
                    console.log('3: User already logged in...');
                    e.preventDefault();
                    $state.go('dashboard');
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    delete $window.sessionStorage.token;
                });
            }
        
            
            if ((toState.name.indexOf('dashboard') > -1  && $window.sessionStorage.token) ||
                 (toState.name.indexOf('users') > -1     && $window.sessionStorage.token) ||
                 (toState.name.indexOf('forbidden') > -1 && $window.sessionStorage.token) ||
                 (toState.name.indexOf('projects') > -1  && $window.sessionStorage.token)) {
                    // If logged in and no user info:
                    console.log('lol');
                    console.log($rootScope.userInfo);
                    userService.verifyToken(token)
                    .success(function(data) {
                        $timeout(function() {
                            $rootScope.userInfo = data;
                        });
                        console.log($rootScope.userInfo);
                        authService.isLogged = true;
                        console.log('4: User already logged in...');
                    })
                    .error(function(status, data) {
                        console.log(status);
                        console.log(data);
                        e.preventDefault();
                        $state.go('home');
                    });
            }
            
            if (toState.name.indexOf('users') > -1) {
                if ($rootScope.userInfo === undefined) {
                    userService.verifyToken(token)
                    .success(function(data) {
                        $timeout(function() {
                            $rootScope.userInfo = data;
                        });
                        console.log(data);
                        authService.isLogged = true;
                        if (data.is_admin === false) {
                            console.log('You are not allowed to access this page');
                            e.preventDefault();
                            $state.go('forbidden');
                        }
                    })
                    .error(function(status, data) {
                        console.log(status);
                        console.log(data);
                        e.preventDefault();
                        $state.go('home');
                    });
                }
                else {
                    console.log($rootScope.userInfo.is_admin);
                    console.log('bitch');
                }
            }
        });
    });
})();