"use strict";

/* global angular */

/**
 * Angular services for forum management
 * @author Fernan Morales <fmorales@student.42.fr>
 */

(function () {
    var forum = angular.module('forumModel', []);
    
    forum.factory('forumService', function($http) {
        return {
            getTopics: function() {
                return $http.get(API_URL + '/forum/categories');
            },
            createTopic: function(name) {
                return $http.post(API_URL + '/forum/createCategory', {
                    name: name
                });
            },
            createSubTopic: function(name, category) {
                return $http.post(API_URL + '/forum/createSubCategory', {
                    name: name,
                    category: category
                });
            },
            removeSubTopic: function(category, subcategory) {
                return $http.post(API_URL + '/forum/removeSubCategory', {
                    category: category,
                    subcategory: subcategory
                });
            },
            modifySubcategory: function(category, subcategory, newName) {
                return $http.post(API_URL + '/forum/modifySubcategory',{
                    category: category,
                    subcategory: subcategory,
                    newName: newName
                });
            },
            modifyCategory: function(category, newName) {
                return $http.post(API_URL + '/forum/modifyCategory', {
                    category: category,
                    newName: newName
                });
            },
            removeTopic: function(category) {
                return $http.post(API_URL + '/forum/removeCategory', {
                    category: category
                });
            },
            createThread: function(name, category, subcategory, body, author) {
                return $http.post(API_URL + '/forum/createThread', {
                    name: name,
                    category: category,
                    subcategory: subcategory,
                    body: body,
                    author: author
                });
            },
            getThreads: function() {
                return $http.get(API_URL + '/forum/threads');
            },
            postCommentBody: function(author, comment, id) {
                return $http.post(API_URL + '/forum/postCommentBody', {
                    author: author,
                    comment: comment,
                    id: id
                });
            },
            postReply: function(author, comment, id) {
                return $http.post(API_URL + '/forum/postReply', {
                    author: author,
                    comment: comment,
                    id: id
                });
            },
            postReplyComment: function(author, comment, postId, id) {
                return $http.post(API_URL + '/forum/postReplyComment', {
                    author: author,
                    comment: comment,
                    postId: postId,
                    id: id
                });
            }
        }
    });
})();