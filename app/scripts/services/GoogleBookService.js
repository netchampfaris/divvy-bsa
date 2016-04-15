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
  .factory('GoogleBookService', ['$http', '$q', function($http, $q) {

    var endpoint = 'https://www.googleapis.com/books/v1/volumes?q=';
    var startIndex = '&startIndex=';

    // public api
    return {
      getEndpoint: function(searchTerms, index) {
        var defer = $q.defer();
        searchTerms = encodeURI(searchTerms);
        var url = endpoint + searchTerms + startIndex + index;
        console.log(url);
        $http({
          method: 'GET',
          url: url
        }).then(function successCallback(response) {
          // this callback will be called asynchronously
          // when the response is available
            defer.resolve(response);
        }, function errorCallback(response) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(response);
          defer.reject();
        });
          return defer.promise;
      }
    };

  }]);
