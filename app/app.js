(function() {
    if (window.location.protocol === "https:")
        API_URL = "https://localhost:8002";
    else
        API_URL = "http://localhost:8001";
    
    var app = angular.module('homepage', [
        'ui.router',
        'adminCtrl',
        'userAuth',
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
        .state('regError', {
            url: '/404',
            views: {
                'menu': {
                    templateUrl: '/templates/menu.html',
                    controller: 'AdminUserCtrl'
                },
                'content': {
                    templateUrl: '/templates/404.html',
                    controller: 'AdminUserCtrl'
                },
                'footer': {
                    templateUrl: '/templates/footer.html',
                    controller: 'AdminUserCtrl',
                }
            }
        })
        
        $locationProvider.html5Mode(true);
    });
    
    app.run(function($rootScope, $state, $window, $cookies, authService, userService) {
        $rootScope.$on("$stateChangeStart", function(e, toState, toParams, fromState, fromParams) {
            var token = $cookies.get('token');
            
            if (toState.name.indexOf('home') > -1 && !$window.sessionStorage.token && fromState.name === "") {
                if (token === undefined)
                    console.log('Welcome to the intranet!');
                else {
                    userService.verifyToken(token)
                    .success(function(data) {
                        $rootScope.$broadcast('logged_in', data);
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
            if (toState.name.indexOf('dashboard') > -1 && !$window.sessionStorage.token && fromState.name === "") {
                // If logged out and transitioning to a logged in page:
                if (token === undefined) {
                    e.preventDefault();
                    $state.go('home');
                }
                else {
                    userService.verifyToken(token)
                    .success(function(data) {
                        $rootScope.$broadcast('logged_in', data);
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
                if ($rootScope.userInfo === undefined) {
                    userService.verifyToken(token)
                    .success(function(data) {
                        $rootScope.userInfo = data;
                    })
                    .error(function(status, data) {
                        console.log(status);
                        console.log(data);
                        e.preventDefault();
                        $state.go('home');
                    });
                }
                authService.isLogged = true;
                console.log('3: User already logged in...');
                e.preventDefault();
                $state.go('dashboard');
            }  
            if (toState.name.indexOf('dashboard') > -1 && $window.sessionStorage.token) {
                // If logged in and no user info:
                if ($rootScope.userInfo === undefined) {
                    userService.verifyToken(token)
                    .success(function(data) {
                        $rootScope.userInfo = data;
                    })
                    .error(function(status, data) {
                        console.log(status);
                        console.log(data);
                        e.preventDefault();
                        $state.go('home');
                    });
                }
                authService.isLogged = true;
                console.log('4: User already logged in...');
            }
        });
    });
})();