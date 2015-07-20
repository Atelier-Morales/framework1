

/* global angular */

/**
 * Angular services of user auth
 * @author Fernan Morales <fmorales@student.42.fr>
 */

(function() {
    var authentification = angular.module("userAuth", []);
    
    authentification.factory('authService', function() {
        var auth = {
            isLogged : false
        }
        return auth;
    });
    
    authentification.factory('userService', function($http) {
        return {
            logIn : function(username, password) {
                return $http.post(API_URL + '/login', 
                { 
                    username: username, 
                    password: pasword
                });
            },
            logOut : function() {
            }
        }
    });
})();
