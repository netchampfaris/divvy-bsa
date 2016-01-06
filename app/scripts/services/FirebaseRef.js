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
  .factory('FirebaseRef', function(FirebaseUrl) {

    var ref = new Firebase(FirebaseUrl);
    return ref;

  });

