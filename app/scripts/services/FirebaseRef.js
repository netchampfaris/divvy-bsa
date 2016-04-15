'use strict';

/**
 * @ngdoc service
 * @name Divvy.FirebaseRef
 * @description
 * # FirebaseRef
 * Retrieves the list of books against search terms.
 *
 */
angular.module('Divvy')
  .factory('FirebaseRef', ['FirebaseUrl', function(FirebaseUrl) {

    return new Firebase(FirebaseUrl);

  }]);
