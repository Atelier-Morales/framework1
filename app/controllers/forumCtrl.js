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
        '$stateParams',
        'forumService',
        'moment',
        function projectCtrl($rootScope, $scope, $location, $window, $state, $log, $timeout, $stateParams, forumService, moment) {
            console.log('Forum section');
            
            console.log($stateParams);
            var colors = ['turquoise', 'crimson', 'blanchedalmond', 'darkorange', 'dodgerblue', 'rebeccapurple', 'thistle', 'wheat', 'teal', 'darksalmon'];
            
            $scope.isBodyCommentOpen = false;
            
            function fetchThreads() {
                forumService.getThreads()
                .success(function(data) {
                    $rootScope.threads = data;
                    $rootScope.threadsCopy = angular.copy($rootScope.threads);
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            function fetchCategories() {
                forumService.getTopics()
                .success(function(data){
                    $rootScope.categories = data;
                    $rootScope.categoriesCopy = angular.copy($rootScope.categories);
                    $timeout(function() {
                        for (var i = 0; i < $rootScope.categoriesCopy.length; i++) {
                            var random_color = colors[Math.floor(Math.random() * colors.length)];
                            var classy = '.head'+i; 
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
            
            $scope.openBodyCommentBox = function() {
                if ($scope.isBodyCommentOpen === true)
                    $scope.isBodyCommentOpen = false;
                else
                    $scope.isBodyCommentOpen = true;
            }
            
            $scope.moveTop = function() {
                $('html, body').animate({scrollTop:0});
            }
            
            $scope.fetchPost = function() {
                $scope.postId = $stateParams.id;
            }
            
            $scope.checkCategory = function(thread, categorias, subcategorias) {
                var cat = [];
                for (var i = 0; i < thread.category.length; ++i)
                    cat.push(thread.category[i].name);
                var index = cat.indexOf(categorias.name);
                var index2 = cat.indexOf(subcategorias.name);
                if (index != -1 && index2 != -1)
                    return (1);
                return (0);
            }
            
            $scope.setThreadCategories = function(categoria, subcategoria) {
                console.log(categoria+' '+subcategoria);
                $scope.threadCategory = categoria;
                $scope.threadSubcategory = subcategoria;
            }
            
            $scope.setScope = function(name) {
                $scope.scopeName = name;
            }
            
            fetchCategories();
            fetchThreads();
            
            $scope.postComment = function(author, comment, id) {
                forumService.postCommentBody(author, comment, id)
                .success(function(data) {
                    $scope.isBodyCommentOpen = false;
                    fetchThreads();
                })
                .error(function(status, data) {
                    $scope.isBodyCommentOpen = false;
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            $scope.postReply = function(author, comment, id) {
                forumService.postReply(author, comment, id)
                .success(function(data) {
                    $('#replyBody').val('')
                    fetchThreads();
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            $scope.createCategory = function createCategory(name) {
                forumService.createTopic(name)
                .success(function(data) {
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
                forumService.createSubTopic(name, category)
                .success(function(data) {
                    $('#categoryModal').foundation('reveal', 'close');
                    console.log('category created');
                    fetchCategories();
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            $scope.removeSubcategory = function removeSubcategory(category, subcategory) {
                forumService.removeSubTopic(category, subcategory)
                .success(function(data) {
                    console.log('category removed');
                    fetchCategories();
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            $scope.createThread = function createThread(name, category, subcategory, body, author) {
                console.log(name, category, subcategory, body, author);
                forumService.createThread(name, category, subcategory, body, author)
                .success(function(data) {
                    fetchThreads();
                    $('#categoryModal').foundation('reveal', 'close');
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                    window.alert('Could not fetch info');
                    $('#categoryModal').foundation('reveal', 'close');
                });
            }
        }
    ]);
})();