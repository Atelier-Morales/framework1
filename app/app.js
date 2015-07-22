(function() {
    if (window.location.protocol === "https:") {
        API_URL = "https://localhost:8002";
        console.log('URL IS '+API_URL);
        console.log('protocol IS '+window.location.protocol);
    }
    else {
        console.log('protocol IS '+window.location.protocol);
        API_URL = "http://localhost:8001";
        console.log('URL IS '+API_URL);
    }
    
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
    
    app.run(function($rootScope, $state, $window, $cookies, authService) {
        $rootScope.$on("$stateChangeStart", function(e, toState, toParams, fromState, fromParams) {
            var token = $cookies.get('token');
            
            if (toState.name.indexOf('home') > -1 && !$window.sessionStorage.token) {
                if (token === undefined)
                    console.log('Welcome to the intranet!');
                else
                {
                    console.log('User already logged. Redirecting...');
                    $state.go('dashboard');
                }
            }
            if (toState.name.indexOf('dashboard') > -1 && !$window.sessionStorage.token) {
                // If logged out and transitioning to a logged in page:
                if (token === undefined) {
                    e.preventDefault();
                    $state.go('home');
                }
                else {
                    $window.sessionStorage.token = token;
                    e.preventDefault();
                    $state.go('dashboard');
                }
                
            }
            if (toState.name.indexOf('home') > -1 && $window.sessionStorage.token) {
                // If logged in and transitioning to a logged out page:
                authService.isLogged = true
                e.preventDefault();
                $state.go('dashboard');
            }
            if (toState.name.indexOf('dashboard') > -1 && $window.sessionStorage.token) {
                // If logged in but somehow authService.isLogged is set to false:
                authService.isLogged = true
            }
        });
    });
})();