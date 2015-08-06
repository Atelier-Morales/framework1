"use strict";

(function() {
    var forumCtrl = angular.module('forumCtrl', [
        'userAuth',
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
        'userService', 
        'authService',
        'projectService',
        'moment',
        function projectCtrl($rootScope, $scope, $location, $window, $state, $log, $timeout, userService, authService, projectService, moment) {
            
        }
    ]);
})();