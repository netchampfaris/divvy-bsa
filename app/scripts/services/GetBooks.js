'use strict';

/**
 * @ngdoc service
 * @name Divvy.GetBooks
 * @description
 * # GetBooks
 * Retrieves the list of books for featured tab
 *
 */
angular.module('Divvy')
  .factory('GetBooks', ['$q', 'FirebaseRef', function($q, FirebaseRef) {

    return {
      all: function () {
        var defer = $q.defer();
        FirebaseRef.child('books').once('value')
          .then(function(snap) {
            defer.resolve(snap.val());
          }).catch(function(err){
            console.log(err);
            defer.reject();
          });
        return defer.promise;
      }
    };

  }]);
