"use strict";

(function() {
    var forumCtrl = angular.module('forumCtrl', [
        'forumModel',
        'ngCookies',
        'sidebarDirective',
        'angularMoment'
    ]);
    
    forumCtrl.controller('forumCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        '$window',
        '$state',
        '$log',
        '$timeout',
        'forumService',
        'moment',
        function projectCtrl($rootScope, $scope, $location, $window, $state, $log, $timeout, forumService, moment) {
            console.log('Forum section');
            function fetchCategories() {
                forumService.getTopics()
                .success(function(data){
                    console.log(data);
                    $scope.categories = data;
                    $scope.categoriesCopy = angular.copy($scope.categories);
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            fetchCategories();
            
            $scope.createCategory = function createCategory(name) {
                forumService.createTopic(name)
                .success(function(data) {
                    console.log(data);
                    $('#projectModal').foundation('reveal', 'close');
                    fetchCategories();
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
        }
    ]);
})();