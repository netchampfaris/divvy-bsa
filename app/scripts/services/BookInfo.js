'use strict';

/**
 * @ngdoc service
 * @name Divvy.BookInfo
 * @description
 * # BookInfo
 * Retrieves the list of books against search terms.
 *
 */
angular.module('Divvy')
  .factory('BookInfo', function($q, FirebaseRef) {

    var book = {};
    var bookowners = [];
    var promises = [];
    return {
      get: function (isbn) {

        var defer = $q.defer();
        FirebaseRef.child('books/'+isbn).once('value', function (booksnap) {
          book = booksnap.val();

          FirebaseRef.child('bookowners/'+isbn).once('value', function (snap) {
            snap.forEach(function (child) {
              var user = child.key();
              var pref = child.val();
              if(pref == 'sell' || pref == 'rent'){
                var dfd = $q.defer();
                FirebaseRef.child('users/'+user+'/books/'+isbn).once('value', function (snap) {
                  bookowners.push({userid: user, pref: snap.val()});
                  dfd.resolve();
                });
                promises.push(dfd.promise);
              }
            });

            $q.all(promises).then(function (data) {
              defer.resolve({
                book: book,
                bookowners: bookowners
              });
            });
          });
        });

        return defer.promise;
      }
    }

  });

