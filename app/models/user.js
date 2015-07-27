
/* global angular */

/**
 * Angular services of user auth
 * @author Fernan Morales <fmorales@student.42.fr>
 */

(function() {
    var authentification = angular.module("userAuth", []);
    
    authentification.factory('authService', function(userService) {
        var auth               = {};

        auth.isLogged = false;
        auth.isAdmin = false;
        auth.userInfo = {};
        
        return auth;
    });
    
    authentification.factory('userService', function($http) {
        return {
            logIn : function(username, password) {
                return $http.post(API_URL + '/user/login', 
                { 
                    username: username, 
                    password: password
                });
            },
            logOut : function(token) {
                return $http.post(API_URL + '/user/logout',
                {
                    token: token
                });
            },
            register: function(username, email, password, passwordConfirmation) {
                return $http.post(API_URL + '/user/register', {
                    username: username, 
                    password: password,
                    email: email,
                    passwordConfirmation: passwordConfirmation 
                });
            },
            verifyToken: function(token) {
                return $http.post(API_URL + '/user/verifyToken',
                {
                    token: token
                });
            },
            fetchUserInfos: function() {
                return $http.get(API_URL + '/user/fetchUsers');
            },
            updateUser: function(username, oldUsername, email, role) {
                return $http.post(API_URL + '/user/updateUser', {
                    username: username,
                    oldUsername: oldUsername,
                    email: email,
                    role: role
                });
            }
        }
    });
})();
