
/* global angular */

/**
 * Angular services of project management
 * @author Fernan Morales <fmorales@student.42.fr>
 */

(function() {
    var project = angular.module("projectModel", []);

    project.factory('projectService', function($http) {
        return {
            createProject : function(name, credits, size, date_regStart, date_regClose, date_start, date_deadline, description) {
                return $http.post(API_URL + '/project/createProject', {
                    name: name,
                    credits: credits,
                    size: size,
                    regStart: date_regStart,
                    regClose: date_regClose,
                    start: date_start,
                    deadline: date_deadline,
                    description: description
                });
            },
            createActivity: function(name, size, groupSize, peerSize, category, automatic, date_regStart, date_regClose, date_start, date_deadline, description, moduleName) {
                return $http.post(API_URL + '/project/createActivity', {
                    name: name,
                    start: date_start,
                    deadline: date_deadline,
                    registration_start: date_regStart,
                    registration_end: date_regClose,
                    description: description,
                    subject: {
                        type: String,
                        required: true,
                        unique: true
                    },
                    group_size: {
                        type: Number,
                        required: true
                    },
                    max_size: {
                        type: Number,
                        required: true,
                    },
                    nb_peers: {
                        type: Number,
                        required: true
                    },
                    automatic_group: {
                        type: Boolean,
                        required: true,
                        default: false
                    },
                    activity_type: {
                        type: String,
                        required: true,
                        unique: true
                    },
                    bareme: {
                        type: String,
                        required: true,
                        default: ""
                    }
                });
            },
            fetchProjects: function(username) {
                return $http.post(API_URL + '/project/fetchProjects', {
                    username: username
                });
            },
            deleteProject: function(name) {
                return $http.post(API_URL + '/project/deleteProject', {
                    name: name
                });
            },
            registerProject: function(name, username, deadline) {
                return $http.post(API_URL + '/user/registerProject', {
                    name: name,
                    username: username,
                    deadline: deadline
                });
            },
            updateProject: function(name, oldname, deadline, description) {
                return $http.post(API_URL + '/project/updateProject', {
                    name: name,
                    oldname: oldname,
                    deadline: deadline,
                    description: description
                });
            },
            fetchAllProjects: function() {
                return $http.get(API_URL + '/project/fetchAllProjects')
            }
        }
    });
})();
