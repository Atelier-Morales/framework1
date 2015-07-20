(function() {
    var app = angular.module('homepage', [
        'ui.router',
        'adminCtrl'
    ])
    .run(function($rootScope) {
        $rootScope.test = "0";
    });
    
    app.config(function($stateProvider, $urlRouterProvider){
 
        $urlRouterProvider.otherwise('/');

        $stateProvider
        .state('home',{
            url: '/',
            views: {
                'menu': {
                    templateUrl: '/templates/menu.html'
                },
                'content': {
                    templateUrl: '/templates/content.html' 
                },
                'footer': {
                    templateUrl: '/templates/footer.html'
                }
            }
        })

        /*.state('dashboard', {
            url: '/dashboard',
            views: {
                'header': {
                    templateUrl: '/templates/partials/header.html'
                },
                'content': {
                    templateUrl: 'templates/dashboard.html',
                    controller: 'DashboardController'
                }
            }

        })*/
    });    
})();