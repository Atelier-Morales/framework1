
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
            createActivity: function(name, size, groupSize, peerSize, category, automatic, date_regStart, date_regClose, date_start, date_deadline, description, moduleName, file) {
                return $http.post(API_URL + '/project/createActivity', {
                    name: name,
                    start: date_start,
                    deadline: date_deadline,
                    registration_start: date_regStart,
                    registration_end: date_regClose,
                    description: description,
                    subject: file,
                    group_size: groupSize,
                    max_size: size,
                    nb_peers: peerSize,
                    automatic_group: automatic,
                    activity_type: category,
                    moduleName: moduleName
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
            deleteActivity: function(name, moduleName) {
                return $http.post(API_URL + '/project/deleteActivity', {
                    name: name,
                    moduleName: moduleName
                });
            },
            registerProject: function(name, username, deadline) {
                return $http.post(API_URL + '/user/registerProject', {
                    name: name,
                    username: username,
                    deadline: deadline
                });
            },
            registerActivity: function(name, username, project) {
                return $http.post(API_URL + '/user/registerActivity', {
                    name: name,
                    username: username,
                    project: project
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
            },
            createBareme: function(module, project_name, questions, preliminary_show, bonus) {
                return $http.post(API_URL + '/project/CreateBareme', {
                    module: module,
                    project_name: project_name,
                    questions: questions,
                    preliminary_show: preliminary_show,
                    bonus: bonus
                })
            },
            updateBareme: function(module, project_name, questions, preliminary_show, bonus) {
                return $http.post(API_URL + '/project/updateBareme', {
                    module: module,
                    project_name: project_name,
                    questions: questions,
                    preliminary_show: preliminary_show,
                    bonus: bonus
                })
            }
        }
    });
})();
