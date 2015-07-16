(function() {
    var app = angular.module('homepage', [ 
        'ui.bootstrap',
        'ngRoute'
    ])
    .run(function($rootScope) {
        $rootScope.test = "0";
    });
    
    app.config(['$routeProvider', function($routeProvider) {
        $routeProvider.
                when('/', 
                {
                    templateUrl: 'templates/intro.html'
                }).
                otherwise({
                    redirectTo: "/"
                });
    }]);
    
    app.controller(
        'HomepageController', 
        [
            '$http', 
            '$log', 
            '$scope', 
            '$modal', 
            '$rootScope', 
            function($http, $log, $scope, $modal, $rootScope)
            {
                $rootScope.tab = 0;
                $rootScope.isCharlie = false;
                $log.log('tab is '+this.tab);
                this.category = 0;
        
                this.setTab = function(newValue){
                    $rootScope.tab = newValue;
                    $rootScope.test = newValue;
                    this.category = 0;
                    $log.log(this.tab);
                };
        
                this.setCategory = function(newValue){
                    $rootScope.isCharlie = false;
                    this.category = newValue;
                    $rootScope.category = newValue;
                    $log.log(this.category);
                };
        
                this.isSet = function(tabName){
                    return $rootScope.tab === tabName;
                };
            }
        ]
    );
    
    app.controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, $rootScope) {
        $scope.items = items[0];
        $scope.size = items[1];
        $scope.category = $rootScope.category;
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });
    
    
    app.directive('footerTab', function() {
        return {
            restrict: 'E',
            templateUrl: 'templates/footer.html'
        }
    });
})();