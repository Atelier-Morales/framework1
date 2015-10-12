(function() {
    if (window.location.protocol === "https:")
        API_URL = "https://localhost:8002";
    else
        API_URL = "http://localhost:8001";
    
    var app = angular.module('homepage', [
        'adminCtrl',
        'projectCtrl',
        'userMgmtCtrl',
        'forumCtrl',
        'ticketCtrl',
        'userAuth',
        'projectModel',
        'forumModel',
        'ui.router',
        'ngCookies',
        'pascalprecht.translate'
    ]);
    
    app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider) {
        
        $translateProvider
        .translations('en', {
            HOME: 'Home',
            HEADLINE: 'Welcome to the Intranet',
            CONNECTION: 'Login',
            REGISTER: 'Signup',
            USERNAME: 'Username',
            PASSWORD: 'Password',
            CONFIRM: 'Confirm password',
            WELCOMEBACK: 'Welcome back!',
            CONFIRMREG: 'Please log in to confirm your registration',
            INCORRECT: 'Email/password are incorrect',
            NEWUSER: 'Hello, new user!',
            REQUIREDUSERNAME: 'Username is required',
            REQUIREDEMAIL: 'Email is required',
            INVALIDEMAIL: 'Invalid email address',
            REQUIREDPASS: 'Password is required',
            COMFIRMPASS: 'Please confirm password',
            PASSDONTMATCH: 'Passwords don\'t match',
            REGERROR: 'Registration error!',
            CONTACTUS: 'Contact Us',
            SEND: 'Send',
            WELCOME: 'Welcome to the Intranet',
            YOURPROJECTS: 'Your projects',
            PROGRESS: 'In Progress',
            FINISH: 'finish',
            NOGRADE: 'No grade yet',
            ONGOING: 'In progress',
            SUCCESS: 'Successful',
            DONE: 'done',
            PROJECTDONE: 'project done',
            GRADE: 'grade',
            SUBMITTED: 'Submitted on',
            FAILED: 'Failed',
            ADMINISTRATION: 'Administration section',
            USERS: 'Users',
            PROJECTS: 'Projects',
            USERSLIST: 'Users List',
            REGDATE: 'Registration date',
            UPDATE: 'Update',
            REMOVE: 'Remove',
            CREATEPROJECT: 'Create a Project',
            NAME: 'Name',
            DEADLINE: 'Set deadline',
            BADDATE: 'Bad Date! Choose another one.',
            CREATE: 'Create',
            CREATED: 'Created',
            PROJECTERROR: 'Creation error!',
            UPDATEPROJECT: 'Update project',
            TICKETSPOOL: 'Ticket Spool',
            CREATETICKETCATEGORY: 'Create a ticket category',
            ALL: 'All',
            OPEN: 'Open',
            CLOSED: 'Closed',
            CLOSE: 'close',
            ASSIGNTO: 'Assigned to',
            ASSIGN: 'Assign to',
            UNASSIGNED: 'Unassigned',
            OPENTICKETS: 'Open tickets',
            CLOSEDTICKETS: 'Closed Tickets',
            ALLTICKETS: 'All tickets',
            BY: 'by',
            IN: 'in',
            ON : 'on',
            OR: 'or',
            VIEW: 'View',
            CREATECATEGORY: 'Create category',
            CATEGORY: 'category',
            SUBCATEGORY: 'sub-category',
            BACKTOLIST: 'Go back to list',
            POSTEDON: 'Posted on',
            NOBODY: 'nobody',
            CHANGESTATUS: 'Change status',
            POSTRESPONSE: 'Post your response here',
            CREATECATEGORY: 'Create a category',
            CREATESUBCATEGORY: 'Create a sub-category',
            MODIFYCATEGORY: 'Modify category',
            MODIFYSUBCATEGORY: 'Modify sub-category',
            LATESTPOST: 'Latest posts',
            COMMENT: 'comment',
            TYPE: 'Type a few words...',
            YOUR: 'your',
            DISPLAY: 'display',
            SUBMITISSUE: 'Soumettez votre problème',
            REOPEN: 're-open',
            TOREPLY: 'to reply',
            AVAILABLEPROJECTS: 'Available projects'
        })
        .translations('fr', {
            HOME: 'Accueil',
            HEADLINE: 'Bienvenue dans l\'Intranet',
            CONNECTION: 'Connexion',
            REGISTER: 'Inscription',
            USERNAME: 'Nom d\'utilisateur',
            PASSWORD: 'Mot de passe',
            CONFIRM: 'Confirmez le mot de passe',
            WELCOMEBACK: 'Heureux de te revoir!',
            CONFIRMREG: 'Connectez-vous pour confirmer votre inscription',
            INCORRECT: 'Mauvais Email/Mot de passe',
            NEWUSER: 'Bonjour, nouvel utilisateur!',
            REQUIREDUSERNAME: 'Nom d\'utilisateur requis',
            REQUIREDEMAIL: 'Email requis',
            INVALIDEMAIL: 'Email invalide',
            REQUIREDPASS: 'Mot de passe requis',
            COMFIRMPASS: 'Confirmez le mot de passe SVP',
            PASSDONTMATCH: 'Les mdp ne correspondent pas',
            REGERROR: 'Probleme d\inscription!',
            CONTACTUS: 'Contactez-nous',
            SEND: 'Envoyer',
            WELCOME: 'Bienvenue dans l\'intranet',
            YOURPROJECTS: 'Vos projets',
            PROGRESS: 'En cours',
            FINISH: 'terminer',
            NOGRADE: 'Note indisponible',
            ONGOING: 'En cours',
            SUCCESS: 'Réussis',
            DONE: 'fait',
            PROJECTDONE: 'projet terminé',
            GRADE: 'note',
            SUBMITTED: 'Rendu le',
            FAILED: 'Echoués',
            ADMINISTRATION: 'Section d\'administration',
            USERS: 'Utilisateurs',
            PROJECTS: 'Projets',
            USERSLIST: 'Liste des utilisateurs',
            REGDATE: 'Date d\'inscription',
            UPDATE: 'Modifier',
            REMOVE: 'Supprimer',
            CREATEPROJECT: 'Créer un projet',
            NAME: 'Nom',
            DEADLINE: 'Fixer deadline',
            BADDATE: 'Mauvaise date! Choisis une autre.',
            CREATE: 'Créer',
            CREATED: 'Créé',
            PROJECTERROR: 'Erreur de création',
            UPDATEPROJECT: 'Modifier projet',
            TICKETSPOOL: 'Spool de tickets',
            CREATETICKETCATEGORY: 'Créer une catégorie de ticket',
            ALL: 'Tous',
            OPEN: 'Ouvert',
            CLOSED: 'Fermé',
            CLOSE: 'fermer',
            ASSIGNTO: 'Assigné à',
            ASSIGN: 'Assigner à',
            UNASSIGNED: 'Non-assigné',
            OPENTICKETS: 'Tickets ouverts',
            CLOSEDTICKETS: 'Tickets fermés',
            ALLTICKETS: 'Tous les tickets',
            BY: 'par',
            IN: 'dans',
            ON : 'le',
            OR: 'ou',
            VIEW: 'Voir',
            CREATECATEGORY: 'Créer catégorie',
            CATEGORY: 'catégorie',
            SUBCATEGORY: 'sous-catégorie',
            BACKTOLIST: 'Revenir à la liste',
            POSTEDON: 'Posté le',
            NOBODY: 'personne',
            CHANGESTATUS: 'Changer statut',
            POSTRESPONSE: 'Postez votre réponse ici',
            CREATECATEGORY: 'Créer une catégorie',
            CREATESUBCATEGORY: 'Créer une sous-catégorie',
            MODIFYCATEGORY: 'Modifier catégorie',
            MODIFYSUBCATEGORY: 'Modifier sous-catégorie',
            LATESTPOST: 'Derniers posts',
            COMMENT: 'commenter',
            TYPE: 'Ecrivez 2-3 mots...',
            YOUR: 'vos',
            DISPLAY: 'afficher',
            SUBMITISSUE: 'Soumettez votre problème',
            REOPEN: 'réouvrir',
            TOREPLY: 'pour répondre',
            AVAILABLEPROJECTS: 'Projets disponibles' 
        });
        $translateProvider.preferredLanguage('en');
        
        $urlRouterProvider.otherwise('/home');
        $urlRouterProvider.when("/forum", "/forum/list");
        $urlRouterProvider.when("/users", "/users/administration");
        $urlRouterProvider.when("/users/tickets", "/users/tickets/all");
        $urlRouterProvider.when("/tickets", "/tickets/all");
        
        $stateProvider
        .state('home',{
            url: '/home',
            views: {
                'menu': {
                    templateUrl: '/templates/menu.html',
                    controller: 'AdminUserCtrl'
                },
                'content': {
                    templateUrl: '/templates/content.html',
                    controller: 'AdminUserCtrl'
                },
                'footer': {
                    templateUrl: '/templates/footer.html',
                    controller: 'AdminUserCtrl',
                }
            }
        })
        .state('dashboard', {
            url: '/dashboard',
            views: {
                'menu': {
                    templateUrl: '/templates/menuLogged.html',
                    controller: 'AdminUserCtrl'
                },
                'content': {
                    templateUrl: '/templates/adminView.html',
                    controller: 'AdminUserCtrl'
                }
            }

        })
        .state('users', {
            url: '/users',
            views: {
                'menu': {
                    templateUrl: '/templates/menuLogged.html',
                    controller: 'AdminUserCtrl'
                },
                'content': {
                    templateUrl: '/templates/usersView.html',
                    controller: 'userMgmtCtrl'
                }
            }
        })
        .state('users.administration', {
            url: '/administration',
            templateUrl: '/templates/users.administration.html',
            controller: 'userMgmtCtrl'
        })
        .state('users.projects', {
            url: '/projects',
            templateUrl: '/templates/users.projects.html',
            controller: 'projectCtrl'
        })
        .state('users.tickets', {
            url: '/tickets',
            templateUrl: '/templates/users.tickets.html',
            controller: 'ticketCtrl'
        })
        .state('users.tickets.list', {
            url: '/all',
            templateUrl: '/templates/users.tickets.list.html',
            controller: 'ticketCtrl'
        })
        .state('users.tickets.view', {
            url: '/:ticketId',
            templateUrl: '/templates/users.tickets.view.html',
            controller: 'ticketCtrl'
        })
        .state('projects', {
            url: '/projects',
            views: {
                'menu': {
                    templateUrl: '/templates/menuLogged.html',
                    controller: 'AdminUserCtrl'
                },
                'content': {
                    templateUrl: '/templates/projects.html',
                    controller: 'projectCtrl'
                }
            }
        })
        .state('forum', {
            url: '/forum',
            views: {
                'menu': {
                    templateUrl: '/templates/menuLogged.html',
                    controller: 'AdminUserCtrl'
                },
                'content': {
                    templateUrl: '/templates/forum.html',
                    controller: 'forumCtrl'
                }
            }
        })
        .state('forum.list', {
            url: '/list',
            templateUrl: '/templates/forum.list.html',
            controller: 'forumCtrl'
        })
        .state('forum.post', {
            url: '/:catId/:subcatId/:id',
            templateUrl: '/templates/forum.post.html',
            controller: 'forumCtrl'
        })
        .state('tickets', {
            url: '/tickets',
            views: {
                'menu': {
                    templateUrl: '/templates/menuLogged.html',
                    controller: 'AdminUserCtrl'
                },
                'content': {
                    templateUrl: '/templates/tickets.html',
                    controller: 'ticketCtrl'
                }
            }
        })
        .state('tickets.all', {
            url: '/all',
            templateUrl: '/templates/tickets.all.html',
            controller: 'ticketCtrl'
        })
        .state('tickets.view', {
            url: '/:id',
            templateUrl: '/templates/tickets.view.html',
            controller: 'ticketCtrl'
        })
        .state('forbidden', {
            url: '/403',
            views: {
                'menu': {
                    templateUrl: '/templates/menuLogged.html',
                    controller: 'AdminUserCtrl'
                },
                'content': {
                    templateUrl: '/templates/403.html',
                    controller: 'AdminUserCtrl'
                }
            }
        })
        
        $locationProvider.html5Mode(true);
    });
    
    app.run(function($rootScope, $state, $window, $cookies, $timeout, authService, userService, $translate) {
        $rootScope.$on("$stateChangeStart", function(e, toState, toParams, fromState, fromParams) {
            var token = $cookies.get('token');
            
            if (toState.name.indexOf('home') > -1 && !$window.sessionStorage.token && fromState.name === "") {
                if (token === undefined)
                    console.log('Welcome to the intranet!');
                else {
                    userService.verifyToken(token)
                    .success(function(data) {
                        $timeout(function() {
                            $rootScope.userInfo = data;                         
                        });
                        console.log('1: User already logged in. Redirecting...');
                        $window.sessionStorage.token = token;
                        e.preventDefault();
                        
                        $state.go('dashboard');
                    })
                    .error(function(status, data) {
                        console.log(status);
                         console.log(data);
                    });
                }
            }
            if ((toState.name.indexOf('dashboard') > -1 ||
                 toState.name.indexOf('users') > -1     ||
                 toState.name.indexOf('forbidden') > -1 ||
                 toState.name.indexOf('forum') > -1 ||
                 toState.name.indexOf('tickets') > -1 ||
                 toState.name.indexOf('projects') > -1)
                 && !$window.sessionStorage.token) {
                // If logged out and transitioning to a logged in page:
                if (token === undefined) {
                    e.preventDefault();
                    $state.go('home');
                }
                else {
                    userService.verifyToken(token)
                    .success(function(data) {
                        $timeout(function() {
                            $rootScope.userInfo = data;
                        });
                        console.log($rootScope.userInfo);
                        console.log('2: User already logged in...');
                        $window.sessionStorage.token = token;
                    })
                    .error(function(status, data) {
                        console.log(status);
                        console.log(data);
                        e.preventDefault();
                        $state.go('home');
                    });
                } 
            }
            if (toState.name.indexOf('home') > -1 && $window.sessionStorage.token) {
                // If logged in and transitioning to a logged out page:
                userService.verifyToken(token)
                .success(function(data) {
                    $timeout(function() {
                        $rootScope.userInfo = data;
                    });
                    authService.isLogged = true;
                    console.log('3: User already logged in...');
                    e.preventDefault();
                    $state.go('dashboard');
                })
                .error(function(status, data) {
                    console.log(status);
                    console.log(data);
                    delete $window.sessionStorage.token;
                });
            }
            if ((toState.name.indexOf('dashboard') > -1  && $window.sessionStorage.token) ||
                 (toState.name.indexOf('users') > -1     && $window.sessionStorage.token) ||
                 (toState.name.indexOf('forbidden') > -1 && $window.sessionStorage.token) ||
                 (toState.name.indexOf('forum') > -1 && $window.sessionStorage.token) ||
                 (toState.name.indexOf('tickets') > -1 && $window.sessionStorage.token) ||
                 (toState.name.indexOf('projects') > -1  && $window.sessionStorage.token)) {
                    // If logged in and no user info:
                    console.log($rootScope.userInfo);
                    userService.verifyToken(token)
                    .success(function(data) {
                        $timeout(function() {
                            $rootScope.userInfo = data;
                        });
                        console.log($rootScope.userInfo);
                        authService.isLogged = true;
                        console.log('4: User already logged in...');
                    })
                    .error(function(status, data) {
                        console.log(status);
                        console.log(data);
                        e.preventDefault();
                        $state.go('home');
                    });
            }
            
            if (toState.name.indexOf('users') > -1) {
                if ($rootScope.userInfo === undefined) {
                    userService.verifyToken(token)
                    .success(function(data) {
                        $timeout(function() {
                            $rootScope.userInfo = data;
                        });
                        console.log(data);
                        authService.isLogged = true;
                        if (data.is_admin === false) {
                            console.log('You are not allowed to access this page');
                            e.preventDefault();
                            $state.go('forbidden');
                        }
                    })
                    .error(function(status, data) {
                        console.log(status);
                        console.log(data);
                        e.preventDefault();
                        $state.go('home');
                    });
                }
                else {
                    console.log($rootScope.userInfo.is_admin);
                    console.log('fail');
                }
            }
        });
    });
})();