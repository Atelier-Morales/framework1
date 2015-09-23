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
            fetchCategories();
        }
    ]);
})();