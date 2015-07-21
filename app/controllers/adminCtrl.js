/*
 *  Admin login controller
 *  by Fernan Morales : fmorales@student.42.fr
 *
 */

(function() {
    var adminCtrl = angular.module('adminCtrl', ['userAuth']);
    
    adminCtrl.controller('AdminUserCtrl', [
        '$scope',
        '$location',
        '$window',
        '$state',
        '$log',
        'userService', 
        'authService',
        function AdminUserCtrl($scope, $location, $window, $state, $log, userService, authService) {
            //Admin User Controller (login, logout)
            $scope.authError = false;
            $scope.regError = false;
            $scope.confirmAuth = false;
            
            if (!authService.isLogged && $state.is('dashboard'))
                $state.go('home');
            else if (authService.isLogged && $state.is('dashboard'))
                $state.go('dashboard');
            
            $scope.logIn = function logIn(username, password) {
                if (username !== undefined && password !== undefined) {
                    userService.logIn(username, password).success(function(data) {
                        $('#myModal').foundation('reveal', 'close');
                        $log.log('User '+username+' successfully logged in');
                        $scope.authError = false;
                        authService.isLogged = true;
                        $window.sessionStorage.token = data.token;
                        $state.go('dashboard');
                    }).error(function(status, data) {
                        console.log(status);
                        console.log(data);
                        $scope.authError = true;
                    });
                }
            }
                
            $scope.logOut = function logOut() {
                if (authService.isLogged) {
                    authService.isLogged = false;
                    delete $window.sessionStorage.token;
                    $state.go("home");
                }
            }
            
            $scope.register = function register(username, email, password, passwordConfirm) {
                if (authService.isLogged) {
                    $('#myModal2').foundation('reveal', 'close');
                    $log.log('User already registered');
                    $state.go('dashboard');
                }
                else {
                    userService.register(username, email, password, passwordConfirm).success(function(data) {
                        $log.log('user successfully registered');
                        $scope.confirmAuth = true;
                        $('#myModal2').foundation('reveal', 'close');
                        $('#myModal').foundation('reveal', 'open');
                    }).error(function(status, data) {
                        console.log(status);
                        console.log(data);
                        $log.log('Registration failed!');
                        $scope.regError = true;
                    });
                }
            }
        }
    ]);
})();