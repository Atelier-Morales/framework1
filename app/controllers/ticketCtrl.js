"use strict";

(function() {
    var ticketCtrl = angular.module('ticketCtrl', [
        'ticketModel',
        'userAuth',
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
        'userService',
        'moment',
        function ticketCtrl($rootScope, $scope, $location, $window, $state, $log, $timeout, $stateParams, ticketService, userService, moment) {
            console.log('Ticket section');
            
            $scope.currentStatus = 'open';
            $scope.adminFilter = undefined;
            $scope.myFilter = { status : 'open' };
            $scope.adminStatus = 'all';
            
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
            
            function getAdminUsers() {
                userService.fetchUserInfos()
                .success(function(data){
                    $scope.adminUsers = [];
                    for (var i = 0; i < data.length; ++i) {
                        if (data[i].is_admin === true)
                            $scope.adminUsers.push({username: data[i].username});
                    }
                    $scope.adminUsersCopy = angular.copy($scope.adminUsers);
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    console.log('Could not fetch info');
                });
            }
            
            fetchCategories();
            fetchTickets();
            getAdminUsers();
            
            $rootScope.$watch('userInfo', function () {
                if ($rootScope.userInfo === undefined || $rootScope.userInfo === null || $rootScope.userInfo === "")
                    return;
                fetchUserTickets($rootScope.userInfo.username);
            })
            
            $scope.changeTicketStatus = function changeTicketStatus(status) {
                if (status === $scope.currentStatus)
                    return;
                if (status != 'all')
                    $scope.myFilter = { status : status };
                else
                    $scope.myFilter = undefined;
                console.log($scope.myFilter);
                $scope.currentStatus = status;
            }
            
            $scope.filterByAdmin = function filterByAdmin(option) {
                if (status === $scope.adminStatus)
                    return;
                if (option != 'all')
                    $scope.adminFilter = { assignTo : option };
                else
                    $scope.adminFilter = undefined;
                $scope.adminStatus = option;
                console.log($scope.adminFilter);
            }
            
            $scope.fetchId = function() {
                if ($scope.ticketsCopy === undefined)
                    return;
                var id = $stateParams.ticketId;
                for (var i = 0; i < $scope.ticketsCopy.length; ++i) {
                    if ($scope.ticketsCopy[i].id == id) {
                        $scope.currentTicket = $scope.ticketsCopy[i];
                    }
                }
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
                    fetchUserTickets($rootScope.userInfo.username);
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    $('#ticketModal').foundation('reveal', 'close');
                    console.log('Could not fetch info');
                });
            }
            
            $scope.postTicketReply = function postTicketReply(author, body, id) {
                console.log(author+' '+body+' '+id);
                $('#replyBody').val('')
            }
            
            $scope.updateTicket = function updateTicket(assigner, status, ticketId) {
                ticketService.updateTicket(assigner, status, ticketId)
                .success(function(data) {
                    fetchTickets();
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