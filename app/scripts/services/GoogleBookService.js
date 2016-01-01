'use strict';

/**
 * @ngdoc service
 * @name Divvy.GoogleBookService
 * @description
 * # GoogleBookService
 * Retrieves the list of books against search terms.
 *
 */
angular.module('Divvy')
  .factory('GoogleBookService', function($http, GoogleBooksAPI, $q) {

    var endpoint = GoogleBooksAPI.url;

    // activate for basic auth
    // public api
    return {
      getEndpoint: function(searchTerms) {
        var defer = $q.defer();
        console.log(endpoint + searchTerms);
        $http({
          method: 'GET',
          url: endpoint + searchTerms
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
            defer.resolve(response);
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          defer.reject();
        });
          return defer.promise;
      }
    };

  });

