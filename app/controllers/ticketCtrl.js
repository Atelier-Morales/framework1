"use strict";

(function() {
    var ticketCtrl = angular.module('ticketCtrl', [
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
        'forumService',
        'moment',
        function ticketCtrl($rootScope, $scope, $location, $window, $state, $log, $timeout, $stateParams, forumService, moment) {
            console.log('Ticket section');
            console.log($rootScope.userInfo);
        }
    ]);
})();