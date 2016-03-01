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
  .factory('BookInfo', function($q, FirebaseRef, $localStorage) {


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
              if(pref && user != $localStorage.authData.uid){

                var dfd = $q.defer();

                $q.all([
                  FirebaseRef.child('users/'+user+'/books/'+isbn).once('value'),
                  FirebaseRef.child('users/'+user+'/name').once('value'),
                  FirebaseRef.child('users/'+user+'/img').once('value'),
                  FirebaseRef.child('users/'+user+'/location').once('value')
                ])
                  .then(function (response) {
                    bookowners.push({
                      uid: user,
                      pref: response[0].val(),
                      name: response[1].val(),
                      img: response[2].val(),
                      location: response[3].val()
                    });
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

