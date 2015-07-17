

/* global angular */

/**
 * Angular model of user auth
 * @author Fernan Morales <fmorales@student.42.fr>
 */

var uniAuth = angular.module("model.User", []);

uniAuth.factory('User', ['$http', '$rootScope', '$q', function($http, $rootScope, $q) {
  var User               = {};
  var userObject         = null;
  var unreadNotification = 0;

  var unreadNotificationCalc = function() {
    var notifs = userObject.notifications;

    if (!notifs) return false;
    notifs.forEach(function(notif) {
      if (notif.read == false)
	unreadNotification += 1;
    });
    return false;
  };

  /**
   * Must call when starting the web app
   * @return {null} [description]
   */
    
  User.init = function(opts, cb) {
    $http.get(API_URL + '/api/users/isLogged')
      .success(function(user) {
	      User.setUser(user);
	      if (cb) return cb(user);
        return false;
      })
      .error(function(res, status) {
	      if (status !== 401) {
          $('.offline-mask').show();
	        throw 'Server unreachable';
        }
        return false;
      });
  };

  User.isLogged = function(opts, cb) {
    $http.get(API_URL + '/api/users/isLogged')
      .success(function(user) {
	      if (cb) return cb(user);
        return false;
      })
      .error(function(res, status) {
	      if (status !== 401) {
          $('.offline-mask').show();
	        throw 'Server unreachable';
        }
        return false;
      });
  };
    
  /**
   * set the User Object variable
   * @param {null} user
   */
    
  User.setUser = function(user) {
    userObject = user;

    if (user == null)
      $rootScope.$broadcast('logged_out', null);
    else
      $rootScope.$broadcast('logged_in', userObject);
  };

  /*User.addNotification = function(notif) {
    unreadNotification += 1;
    userObject.notifications.unshift(notif);
  };

  User.getNotifications = function() {
    return userObject.notifications;
  };

  User.getUnreadNotifications = function() {
    return unreadNotification;
  };

  User.markNotificationsAsRead = function() {
    unreadNotification = 0;
    $http.get(API_URL + '/api/notifications/mark_as_read')
      .success(function(user) {
	User.setUser(user);
      }).error(function(err) {
	console.log('Error', err);
      });
  };*/
  /**
   * return the user object
   * @return {[type]} [description]
   */
    
  User.getUser = function() {
    return userObject;
  };

  User.refresh = function(cb) {
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

  User.isLocallyLogged = function() {
    return userObject == null ? false : true;
  };

  User.logout = function(cb) {
    $http.get(API_URL + '/api/users/logout')
      .success(function(user) {
	User.setUser(null);
	return cb();
      });
  };

  User.stateChanger = function(log) {
    $rootScope.$on('logged_in', log.logged_in);
    $rootScope.$on('logged_out', log.logged_out);
  };

  User.login = function(username, password, cb) {
    $http.post(API_URL + '/api/users/login', {
      username : username,
      password : password
    }).success(function(user) {
      User.setUser(user);
      return cb(null, user);
    }).error(function(err) {
      return cb(err, null);
    });
  };

  User.register = function(data, cb) {
    $http.post(API_URL + '/api/users/register', data).success(function(user) {
      User.setUser(user);
      return cb(null, user);
    }).error(function(err) {
      return cb(err.err, null);
    });
  };

  User.update = function(dt, cb) {
    $http.post(API_URL + '/api/users/update', dt).success(function(user) {
      User.setUser(user);
      return cb(null, user);
    }).error(function(err) {
      return cb(err, null);
    });
  };


  /**
   * This method can be hited publicily
   */
  User.getUserByUsername = function(username, cb) {
    $http.get(API_URL + '/api/users/show/' + username)
      .success(function(dt) {
	return cb(null, dt.user, dt.trips);
      })
      .error(function(err) {
	return cb(err, null);
      });
  };
  return User;
}]);
