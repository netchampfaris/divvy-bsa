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


    return {
      get: function (isbn) {
        var book = {};
        var bookowners = [];
        var promises = [];

        var defer = $q.defer();
        FirebaseRef.child('books/'+isbn).once('value', function (booksnap) {
          book = booksnap.val();

          FirebaseRef.child('bookowners/'+isbn).once('value', function (snap) {
            snap.forEach(function (child) {
              var user = child.key();
              var pref = child.val(); //true for shared, false for not shared
              if(pref){
                var dfd = $q.defer();
                FirebaseRef.child('users/'+user+'/books/'+isbn).once('value', function (snap) {
                  FirebaseRef.child('users/'+user+'/name').once('value', function (name) {
                    bookowners.push({userid: user, name: name.val(), pref: snap.val()});
                    dfd.resolve();
                  });
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

