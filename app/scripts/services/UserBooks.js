'use strict';

/**
 * @ngdoc service
 * @name Divvy.UserBooks
 * @description
 * # UserBooks
 * Retrieves the list of books with info in users library from firebase.
 *
 */
angular.module('Divvy')
  .factory('UserBooks', function(FirebaseRef, $q,_) {

    var getUserBooks = function (id) {
      var defer = $q.defer();
      FirebaseRef.child('users/'+id+'/books').once('value', function (data) {
        var userbooks = {};
        data.forEach(function (child) {
          userbooks[child.key()] = {};
          userbooks[child.key()].userBook = child.val();
        });
        defer.resolve(userbooks);
      }, function (err) {
        defer.reject();
      });
      return defer.promise;
    };

    return {
      get : function (id) {
        var defer = $q.defer();
        getUserBooks(id).then(function (userbooks) {
          var userbooksinfo = [];
          angular.forEach(userbooks, function (value, isbn) {
            var dfd = $q.defer();
            FirebaseRef.child('books/'+isbn).once('value', function (data) {
              var book = {};
              book[data.key()] = data.val();
              dfd.resolve(book);
            });
            userbooksinfo.push(dfd.promise);
          });

          $q.all(userbooksinfo).then(function (userbooksinfo) {
            userbooksinfo = _.flatMap(userbooksinfo, function (b) {
              for(var key in b)
              {
                if(b.hasOwnProperty(key))
                  b[key].key = key;
              }
              return b[key];
            });
            for(var i = 0; i<userbooksinfo.length; i++){
              var isbn = userbooksinfo[i].key;
              userbooks[isbn]['info'] = userbooksinfo[i];
            }
            console.log('fetched userbooks from db');
            defer.resolve(userbooks);
          })
        });
        return defer.promise;
      }
    }

  });

