"use strict";
/* global angular */

/**
 * Angular services of user auth
 * @author Fernan Morales <fmorales@student.42.fr>
 */

(function () {
    var authentification = angular.module("userAuth", []);

    authentification.factory('authService', function (userService) {
        var auth = {};

        auth.isLogged = false;
        auth.isAdmin = false;
        auth.userInfo = {};

        return auth;
    });

    authentification.factory('userService', function ($http) {
        return {
            logIn: function (username, password) {
                return $http.post(API_URL + '/user/login', {
                    username: username,
                    password: password
                });
            },
            logAs: function (username) {
                return $http.post(API_URL + '/user/logAs', {
                    username: username
                });
            },
            logInLDAP: function (username, password) {
                return $http.post(API_URL + '/user/loginLDAP', {
                    username: username,
                    password: password
                });
            },
            logOut: function (username, token) {
                return $http.post(API_URL + '/user/logout', {
                    username: username,
                    token: token
                });
            },
            register: function (username, email, password, passwordConfirmation) {
                return $http.post(API_URL + '/user/register', {
                    username: username,
                    password: password,
                    email: email,
                    passwordConfirmation: passwordConfirmation
                });
            },
            verifyToken: function (token) {
                return $http.post(API_URL + '/user/verifyToken', {
                    token: token
                });
            },
            verifyTokenLDAP: function (token) {
                return $http.post(API_URL + '/user/verifyTokenLDAP', {
                    token: token
                });
            },
            fetchUserInfos: function () {
                return $http.get(API_URL + '/user/fetchUsers');
            },
            updateUser: function (username, oldUsername, email, role) {
                return $http.post(API_URL + '/user/updateUser', {
                    username: username,
                    oldUsername: oldUsername,
                    email: email,
                    role: role
                });
            },
            removeUser: function (username) {
                return $http.post(API_URL + '/user/removeUser', {
                    username: username
                });
            },
            completeProject: function (name, username) {
                return $http.post(API_URL + '/user/completeProject', {
                    name: name,
                    username: username
                });
            },
            correctProject: function (username, correctee, project, grade) {
                return $http.post(API_URL + '/user/correctProject', {
                    username: username,
                    correctee: correctee,
                    project: project,
                    grade: grade
                });
            },
            sendEmail: function (sender, subject, text) {
                return $http.post(API_URL + '/emailSend', {
                    sender: sender,
                    subject: subject,
                    text: text
                });
            },
            changeLanguage: function (user, lang) {
                return $http.post(API_URL + '/user/changeLanguage', {
                    user: user,
                    lang: lang
                });
            },
            getLanguage: function (user) {
                return $http.post(API_URL + '/user/getLanguage', {
                    user: user
                });
            },
            getAndSetlanguage: function (user) {
                return $http.post(API_URL + '/user/getAndSetLanguage', {
                    user: user
                });
            },
            fetchAPIinfo: function (token, user) {
                return $http.get('https://api.intra.42.fr/v2/users/' + user, {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
            },
            fetchAPIusers: function (token) {
                return $http.get('https://api.intra.42.fr/v2/cursus/42/users', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
            },
            fetchCampus: function (token) {
                return $http.get('https://api.intra.42.fr/v2/campus', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
            },
            fetchCursus: function (token) {
                return $http.get('https://api.intra.42.fr/v2/cursus', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
            },
            fetchCursusUsers: function (token, cursus) {
                return $http.get('https://api.intra.42.fr/v2/cursus/' + cursus + '/users', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
            },
            fetchUsersLDAP: function () {
                return $http.get(API_URL + '/user/fetchUsersLdap');
            },
            loadMoreUsers: function (token, cursus, currentPage) {
                return $http.get('https://api.intra.42.fr/v2/cursus/' + cursus + '/users', {
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    params: {
                        'page': currentPage
                    }
                });
            },
            logAction: function (log, action, user) {
                return $http.post(API_URL + '/user/logAction', {
                    log: log,
                    action: action,
                    user: user
                });
            },
            removeLoggedAs: function () {
                return $http.get(API_URL + '/user/removeLoggedAs');
            },
            clearLogs: function () {
                return $http.get(API_URL + '/user/clearLogs');
            }
        }
    });
})();
