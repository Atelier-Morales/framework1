

/* global angular */

/**
 * Angular services of user auth
 * @author Fernan Morales <fmorales@student.42.fr>
 */

(function() {
    var authentification = angular.module("userAuth", []);
    
    authentification.factory('authService', function() {
        var auth = {
            isLogged : false,
            isAdmin : false
        }
        return auth;
    });
    
    authentification.factory('userService', function($http) {
        return {
            logIn : function(username, password) {
                return $http.post(API_URL + '/user/login', 
                { 
                    username: username, 
                    password: pasword
                });
            },
            logOut : function() {
                return $http.get(API_URL + '/user/logout');
            },
            register: function(username, email, password, passwordConfirmation) {
                return $http.post(API_URL + '/user/register', {
                    username: username, 
                    password: password,
                    email: email,
                    passwordConfirmation: passwordConfirmation 
                });
            }
        }
    });
})();
