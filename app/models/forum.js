"use strict";
(function () {
    var forum = angular.module('forumModel', []);
    
    forum.factory('forumModel', function($http) {
        return {
            getTopics: function() {
                return $httg.get(API_URL + '/forum/topics');
            }
        }
    });
})();