
/* global angular */

/**
 * Angular services of user auth
 * @author Fernan Morales <fmorales@student.42.fr>
 */

(function() {
    var authentification = angular.module("userAuth", []);
    
    authentification.factory('authService', function() {
        var auth               = {};
        var authObject         = null;

        auth.isLogged = false;
        auth.isAdmin = false;
        
        auth.init = function(opts, cb) {
            $http.get(API_URL + '/api/users/isLogged')
            .success(function(user) {
                auth.setUser(user);
                if (cb) 
                    return cb(user);
                return false;
              })
              .error(function(res, status) {
                if (status !== 401)
                    throw 'Server unreachable';
                return false;
              });
        };
        

        auth.setUser = function(user) {
            userObject = user;
            
            if (user == null)
              $rootScope.$broadcast('logged_out', null);
            else
              $rootScope.$broadcast('logged_in', userObject);
        };
        
        auth.getUser = function() {
            return userObject;
        };
        
        auth.refresh = function(cb) {
            if (!cb) cb = function(){};
            $http.get(API_URL + '/api/users/isLogged')
            .success(function(user) {
                User.setUser(user);
                return cb(null, user);
            })
            .error(function(err) {
                console.error('Err when refresh user', err);
                return cb(err);
            });
        };
        
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
            }
        }
    });
})();
