'use strict';

/**
 * @ngdoc service
 * @name Divvy.GetUserProfile
 * @description
 * # GetUserProfile
 * Retrieves the userprofile information
 *
 */
angular.module('Divvy')
  .factory('GetUserProfile', ['$q', 'FirebaseRef', function($q, FirebaseRef) {


    var getInfo = function(id){

      var defer = $q.defer();
      FirebaseRef.child('users/'+id).once('value', function(snap){
        var userInfo = snap.val();
        defer.resolve({
          name: userInfo.name,
          img: userInfo.img,
          location: userInfo.location.name,
          books: userInfo.books
        });
      });
      return defer.promise;

    };

    return getInfo;

  }]);
