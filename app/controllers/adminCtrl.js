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
            if (!authService.isLogged && $state.is('dashboard'))
                $state.go('home');
            else if (authService.isLogged && $state.is('dashboard'))
                $state.go('dashboard');
            $scope.logIn = function logIn(username, password) {
                $log.log(username);
                $log.log(password);
                /*if (username !== undefined && password !== undefined) {
                    userService.logIn(username, password).success(function(data) {
                        authService.isLogged = true;
                        $window.sessionStorage.token = data.token;
                        $location.path("/admin");
                    }).error(function(status, data) {
                        console.log(status);
                        console.log(data);
                    });
                }*/
            },
            $scope.fuck = function(){
                $log.log('fuck');
            },
            $scope.logOut = function logOut() {
                if (authService.isLogged) {
                    authService.isLogged = false;
                    delete $window.sessionStorage.token;
                    $state.go("home");
                }
            }
            $scope.register = function register(username, email, password, passwordConfirm) {
                $('#myModal2').foundation('reveal', 'close');
                if (authService.isLogged) {
                    $log.log('User already registered');
                    $state.go('dashboard');
                }
                else {
                    userService.register(username, email, password, passwordConfirm).success(function(data) {
                        $log.log('user successfully registered');
                        authService.isLogged = true;
                        $state.go('dashboard');
                    }).error(function(status, data) {
                        console.log(status);
                        console.log(data);
                        $log.log('Regista');
                        $state.go("regError");
                    });
                }
            }
        }
    ]);
})();