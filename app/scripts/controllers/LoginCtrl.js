'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:LoginCtrl
 * @description
 * # LoginCtrl
 */
angular.module('Divvy')
  .controller('LoginCtrl', function($scope, FirebaseRef) {

    $scope.google = function() {
      FirebaseRef.authWithOAuthPopup("google", function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
        }
      },{
        remember: 'default'
      });
    }

  });
