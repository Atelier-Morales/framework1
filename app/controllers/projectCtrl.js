/*
 *  Project controller
 *  by Fernan Morales : fmorales@student.42.fr
 *
 */

(function () {
    var projectCtrl = angular.module('projectCtrl', [
        'userAuth',
        'projectModel',
        'angularMoment',
        'ngFileUpload'
    ]);

    projectCtrl.controller('projectCtrl', [
        '$rootScope',
        '$scope',
        '$location',
        '$window',
        '$state',
        '$log',
        '$timeout',
        '$http',
        'userService',
        'authService',
        'projectService',
        'moment',
        'forumService',
        'Upload',
        function projectCtrl($rootScope, $scope, $location, $window, $state, $log, $timeout, $http, userService, authService, projectService, moment, forumService, Upload) {

            var username = '';
            var count2 = 0;
            $scope.regError = false;

            var start = moment().format('YYYY-MM-DD');
            var end = moment("2016-12-31", "YYYY-MM-DD");
            $scope.date = moment.range(start, end);

            $scope.acc = [];

            $scope.date.by('days', function (moment) {
                $scope.acc.push(moment.format('YYYY-MM-DD'));
            });

            var count = 0;
            $scope.months = [];
            while (count < 12)
                $scope.months.push(moment().month(count++).format("MMMM"));

            var count = 1;
            $scope.days = [];
            while (count <= 31) {
                $scope.days.push(moment().day(count).format("DD"));
                count++;
            }
            $scope.days.sort();
            //console.log($scope.days);

            $scope.years = ['2015', '2016'];

            function fetchProjects(username) {
                projectService.fetchProjects(username)
                    .success(function (data) {
                        $scope.projects = data;
                        $scope.projectsCopy = angular.copy($scope.projects);
                    })
                    .error(function (status, data) {
                        console.log(status);
                        console.log(data);
                        console.log('Could not fetch info');
                    });
            }

            function fetchAllProjects() {
                projectService.fetchAllProjects()
                    .success(function (data) {
                        $scope.allProjects = data;
                        $scope.allProjectsCopy = angular.copy($scope.allProjects);
                    })
                    .error(function (status, data) {
                        console.log(status);
                        console.log(data);
                        console.log('Could not fetch info');
                    });
            }

            if ($state.current.name === "users.projects") {
                console.log("yes");
                fetchAllProjects();
            }

            $scope.setUsername = function (name) {
                if (name != undefined) {
                    if (count2 === 0) {
                        $scope.username = angular.copy(name);
                        fetchProjects($scope.username);
                        count2++
                    }

                }

            }

            $scope.setCategory = function (name) {
                $scope.moduleName = name;
            }

            $scope.date_is_invalid = function (regStart, regClose, start, deadline) {
                if (regStart != undefined) {
                    if (regStart.year != undefined && regStart.month != undefined && regStart.day != undefined) {
                        var reg_start = regStart.year + "-" + regStart.month + "-" + regStart.day;
                        var cust1 = moment(reg_start).format("YYYY-MM-DD");
                        regStart.year = moment(reg_start).format("YYYY");
                        regStart.month = moment(reg_start).format("MMMM");
                        regStart.day = moment(reg_start).format("DD");
                        if (cust1 < moment().format("YYYY-MM-DD"))
                            return false;
                    }
                }
                if (regClose != undefined) {
                    if (regClose.year != undefined && regClose.month != undefined && regClose.day != undefined) {
                        var reg_close = regClose.year + "-" + regClose.month + "-" + regClose.day;
                        var cust2 = moment(reg_close).format("YYYY-MM-DD");
                        regClose.year = moment(reg_close).format("YYYY");
                        regClose.month = moment(reg_close).format("MMMM");
                        regClose.day = moment(reg_close).format("DD");
                        if (cust2 < moment().format("YYYY-MM-DD") || cust1 > cust2)
                            return false;
                    }
                }
                if (start != undefined) {
                    if (start.year != undefined && start.month != undefined && start.day != undefined) {
                        var begin = start.year + "-" + start.month + "-" + start.day;
                        var cust3 = moment(begin).format("YYYY-MM-DD");
                        start.year = moment(begin).format("YYYY");
                        start.month = moment(begin).format("MMMM");
                        start.day = moment(begin).format("DD");
                        if (cust3 < moment().format("YYYY-MM-DD") || cust2 > cust3)
                            return false;
                    }
                }
                if (deadline != undefined) {
                    if (deadline.year != undefined && deadline.month != undefined && deadline.day != undefined) {
                        var end = deadline.year + "-" + deadline.month + "-" + deadline.day;
                        var cust4 = moment(end).format("YYYY-MM-DD");
                        deadline.year = moment(end).format("YYYY");
                        deadline.month = moment(end).format("MMMM");
                        deadline.day = moment(end).format("DD");
                        if (cust4 < moment().format("YYYY-MM-DD") || cust3 > cust4)
                            return false;
                    }
                }
                return true;
            }

            $scope.createProject = function createProject(name, credits, size, regStart, regClose, start, deadline, description) {
                var date_regStart = regStart.year + "-" + regStart.month + "-" + regStart.day;
                var date_regClose = regClose.year + "-" + regClose.month + "-" + regClose.day;
                var date_start = start.year + "-" + start.month + "-" + start.day;
                var date_deadline = deadline.year + "-" + deadline.month + "-" + deadline.day;
                projectService.createProject(name, credits, size, date_regStart, date_regClose, date_start, date_deadline, description)
                    .success(function (data) {
                        console.log(data);
                        forumService.createTopic(name)
                            .success(function (data) {
                                console.log("topic crée");
                            })
                            .error(function (status, data) {
                                console.log(status);
                                console.log(data);
                                console.log('Could not create Topic');
                                $scope.regError = true;
                            })
                        $('#projectModal').foundation('reveal', 'close');
                        fetchAllProjects();
                    })
                    .error(function (status, data) {
                        console.log(status);
                        console.log(data);
                        console.log('Could not fetch info');
                        $scope.regError = true;
                    });
            }

            function uploadFileToUrl(file, uploadUrl){
                var fd = new FormData();
                fd.append('file', file);
                $http.post(uploadUrl, fd, {
                    transformRequest: angular.identity,
                    headers: {'Content-Type': undefined}
                })
                    .success(function(){
                })
                    .error(function(){
                });
            }

            $scope.uploadFile = function(){
                var file = $scope.myFile;
                console.log('file is ' );
                console.dir(file);
                var uploadUrl = API_URL + "/project/uploadSubject";
                uploadFileToUrl(file, uploadUrl);
            };

            $scope.createActivity = function createActivity(name, size, groupSize, peerSize, category, automatic, regStart, regClose, start, deadline, description, moduleName) {
                var date_regStart = regStart.year + "-" + regStart.month + "-" + regStart.day;
                var date_regClose = regClose.year + "-" + regClose.month + "-" + regClose.day;
                var date_start = start.year + "-" + start.month + "-" + start.day;
                var date_deadline = deadline.year + "-" + deadline.month + "-" + deadline.day;
                //console.log(date_regStart+' '+date_regClose+' '+date_start+' '+date_deadline+' '+name+' '+size+' '+groupSize+' '+peerSize+' '+category+' '+automatic+' '+description+' '+moduleName);
                projectService.createActivity(name, size, groupSize, peerSize, category, automatic, date_regStart, date_regClose, date_start, date_deadline, description, moduleName)
                    .success(function (data) {
                        console.log(data);
                        forumService.createSubTopic(name, moduleName)
                            .success(function (data) {
                                console.log("subtopic crée");
                            })
                            .error(function (status, data) {
                                console.log(status);
                                console.log(data);
                                console.log('Could not create Topic');
                                $scope.regError = true;
                            })
                        $('#projectModal').foundation('reveal', 'close');
                        fetchAllProjects();
                    })
                    .error(function (status, data) {
                        console.log(status);
                        console.log(data);
                        console.log('Could not fetch info');
                        $scope.regError = true;
                    });
            }

            $scope.setIndex = function (index) {
                $scope.index = index;
            }

            $scope.deleteProject = function deleteProject(name) {
                var confirm = window.confirm("Are you sure you want to delete the project " + name + "?");
                if (confirm) {
                    console.log('yes');
                    projectService.deleteProject(name)
                        .success(function (data) {
                            fetchAllProjects();
                            console.log('Project ' + name + ' deleted');
                            window.alert('Project ' + name + ' deleted');
                        })
                        .error(function (status, data) {
                            $log.log(status);
                            $log.log(data);
                            window.alert('Failed at deleting project ' + name);
                        });
                } else
                    console.log('nope');
            }

            $scope.updateProject = function updateProject(name, oldname, deadline, description) {
                var date = deadline.year + "-" + deadline.month + "-" + deadline.day;
                projectService.updateProject(name, oldname, date, description)
                    .success(function (data) {
                        $('#updateProjectModal').foundation('reveal', 'close');
                        window.alert('Project ' + oldname + ' updated!');
                        fetchAllProjects();
                    })
                    .error(function (status, data) {
                        console.log(status);
                        console.log(data);
                        console.log('Could not update project');
                        $scope.regError = true;
                    });
            }

            $scope.registerProject = function registerProject(name, username, deadline) {
                var confirm = window.confirm("Are you sure you want to do the project " + name + "?");
                if (confirm) {
                    console.log('yes');
                    projectService.registerProject(name, username, deadline)
                        .success(function (data) {
                            fetchProjects($scope.username);
                            console.log('Registered to project ' + name);
                            window.alert('Registered to project ' + name);
                        })
                        .error(function (status, data) {
                            $log.log(status);
                            $log.log(data);
                            window.alert('Could not register to project ' + name);
                        });
                } else
                    console.log('nope');
            }

        }
    ]);
})();
