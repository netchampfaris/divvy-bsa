'use strict';

/**
 * @ngdoc service
 * @name Divvy.UserBooksLocal
 * @description
 * # UserBooksLocal
 * Retrieves the list of users books from localstorage
 *
 */
angular.module('Divvy')
  .factory('UserBooksLocal', ['UserBooks', '$localStorage', '$q', function(UserBooks, $localStorage, $q) {

    return {
      get : function () {
        var defer = $q.defer();

        if($localStorage.userBooks)
        {
          defer.resolve();
        }
        else {
          UserBooks.get($localStorage.authData.uid).then(function (userBooks) {
            $localStorage.userBooks = userBooks;
            defer.resolve();
          }, function (err) {
            console.log(err);
            defer.reject();
          });
        }

        return defer.promise;
      }
    };

  }]);
