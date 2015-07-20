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
        'userService', 
        'authService',
        function AdminUserCtrl($scope, $location, $window, userService, authService) {
            //Admin User Controller (login, logout)
            $scope.logIn = function logIn(username, password) {
                if (username !== undefined && password !== undefined) {
                    userService.logIn(username, password).success(function(data) {
                        authService.isLogged = true;
                        $window.sessionStorage.token = data.token;
                        $location.path("/admin");
                    }).error(function(status, data) {
                        console.log(status);
                        console.log(data);
                    });
                }
            } 
            $scope.logout = function logout() {
                if (authService.isLogged) {
                    authService.isLogged = false;
                    delete $window.sessionStorage.token;
                    $location.path("/");
                }
            }
        }
    ]);
})();