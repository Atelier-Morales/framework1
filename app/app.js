(function() {
    
    API_URL = "http://localhost:8001";
    
    var app = angular.module('homepage', [
        'ui.router',
        'adminCtrl'
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
                },
                'footer': {
                    templateUrl: '/templates/footer.html',
                    controller: 'AdminUserCtrl',
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
})();