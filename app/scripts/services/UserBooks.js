'use strict';

/**
 * @ngdoc service
 * @name Divvy.UserBooks
 * @description
 * # UserBooks
 * Retrieves the list of books in users library.
 *
 */
angular.module('Divvy')
  .factory('UserBooks', function(FirebaseRef, $q) {

    return {
      get : function (id) {
        var defer = $q.defer();
        console.log(id);
        FirebaseRef.child('users/'+id+'/books').once('value', function (data) {
          var books;
          var userbooks = data.val();

          console.log(userbooks);

          for(var isbn in userbooks)
          {
            console.log(isbn);
            FirebaseRef.child('books/'+isbn).once('value', function (bookdata) {
              console.log(bookdata.val());
              userbooks[isbn]['bookinfo'] = bookdata.val();
            })
          }

          defer.resolve({
            userbooks: userbooks
          });
        }, function (err) {
          defer.reject();
        })
        return defer.promise;
      }
    }

  });

