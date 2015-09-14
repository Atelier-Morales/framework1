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
            
            var colors = ['turquoise', 'crimson', 'blanchedalmond', 'darkorange', 'dodgerblue', 'rebeccapurple', 'thistle', 'wheat', 'teal', 'darksalmon'];
            
            function fetchCategories() {
                forumService.getTopics()
                .success(function(data){
                    console.log(data);
                    $scope.categories = data;
                    $scope.categoriesCopy = angular.copy($scope.categories);
                    $timeout(function() {
                        for (var i = 0; i < $scope.categoriesCopy.length; i++) {
                            var random_color = colors[Math.floor(Math.random() * colors.length)];
                            var classy = '.head'+i; 
                            console.log(classy+' '+random_color);
                            $(classy).css('background', random_color);
                        }
                    });
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            $scope.setScope = function(name) {
                $scope.scopeName = name;
            }
            
            fetchCategories();
            
            $scope.createCategory = function createCategory(name) {
                forumService.createTopic(name)
                .success(function(data) {
                    console.log(data);
                    $('#forumModal').foundation('reveal', 'close');
                    fetchCategories();
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            $scope.createSubCategory = function createSubCategory(name, category) {
                console.log(category);
                forumService.createSubTopic(name, category)
                .success(function(data) {
                    console.log(data);
                    $('#categoryModal').foundation('reveal', 'close');
                    fetchCategories();
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            $scope.removeSubcategory = function removeSubcategory(category, subcategory) {
                console.log(subcategory);
                forumService.removeSubTopic(category, subcategory)
                .success(function(data) {
                    console.log(data);
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