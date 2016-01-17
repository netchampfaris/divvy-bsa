'use strict';

/**
 * @ngdoc service
 * @name Divvy.Auth
 * @description
 * # Auth
 * Retrieves the list of books against search terms.
 *
 */
angular.module('Divvy')
  .factory('Auth', function($firebaseAuth, FirebaseUrl) {
    var ref = new Firebase(FirebaseUrl);
    return $firebaseAuth(ref);
  });

