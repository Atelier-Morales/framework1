(function() {
    
    API_URL = "http://localhost:8001";
    
    var app = angular.module('homepage', [
        'ui.router',
        'adminCtrl',
        'userAuth'
    ]);
    
    app.config(function($stateProvider, $urlRouterProvider){
 
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
                    templateUrl: '/templates/menu.html',
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
    });
    
    app.run(function($rootScope, $state, $window, authService) {
        $rootScope.$on("$stateChangeStart", function(e, toState, toParams, fromState, fromParams) {
            
            if (toState.name.indexOf('dashboard') > -1 && !$window.sessionStorage.token) {
                // If logged out and transitioning to a logged in page:
                e.preventDefault();
                $state.go('home');
            }
            else if (toState.name.indexOf('home') > -1 && $window.sessionStorage.token) {
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