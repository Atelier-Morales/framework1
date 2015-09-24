"use strict";

(function() {
    var ticketCtrl = angular.module('ticketCtrl', [
        'ticketModel',
        'ngCookies',
        'sidebarDirective',
        'angularMoment'
    ]);
    
    ticketCtrl.controller('ticketCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        '$window',
        '$state',
        '$log',
        '$timeout',
        '$stateParams',
        'ticketService',
        'moment',
        function ticketCtrl($rootScope, $scope, $location, $window, $state, $log, $timeout, $stateParams, ticketService, moment) {
            console.log('Ticket section');
            
            function fetchCategories() {
                ticketService.fetchCategories()
                .success(function(data){
                    $scope.ticketCategories = data;
                    $scope.ticketCategoriesCopy = angular.copy($scope.ticketCategories);
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            function fetchTickets() {
                ticketService.fetchTickets()
                .success(function(data){
                    $scope.tickets = data;
                    $scope.ticketsCopy = angular.copy($scope.tickets);
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            function fetchUserTickets(author) {
                ticketService.fetchUserTickets(author)
                .success(function(data){
                    $scope.userTickets = data;
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            fetchCategories();
            fetchTickets();
            
            $rootScope.$watch('userInfo', function () {
                if ($rootScope.userInfo === undefined || $rootScope.userInfo === null || $rootScope.userInfo === "")
                    return;
                fetchUserTickets($rootScope.userInfo.username);
            })
            
            $scope.fetchId = function() {
                $scope.ticketId = $stateParams.ticketId;
            }

            $scope.createCategory = function createCategory(name) {
                ticketService.createCategory(name)
                .success(function(data) {
                    $('#ticketCategoryModal').foundation('reveal', 'close');
                    fetchCategories();
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    $('#ticketCategoryModal').foundation('reveal', 'close');
                    console.log('Could not fetch info');
                });
            }
            
            $scope.createTicket = function createTicket(title, description, category, author) {
                ticketService.createTicket(title, description, category, author)
                .success(function(data) {
                    $('#ticketModal').foundation('reveal', 'close');
                    fetchTickets();
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    $('#ticketModal').foundation('reveal', 'close');
                    console.log('Could not fetch info');
                });
            }
        }
    ]);
})();