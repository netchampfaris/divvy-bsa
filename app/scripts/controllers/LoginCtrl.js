'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:LoginCtrl
 * @description
 * # LoginCtrl
 */
angular.module('Divvy')
  .controller('LoginCtrl', function($scope, FirebaseRef, Auth, $localStorage, $state) {

    if($localStorage.authData)
    {
      $state.go('tab.featured');
    }

    $scope.login = function(authMethod) {
      Auth.$authWithOAuthRedirect(authMethod).then(function(authData) {
      }).catch(function(error) {
        if (error.code === 'TRANSPORT_UNAVAILABLE') {
          Auth.$authWithOAuthPopup(authMethod).then(function(authData) {
          });
        } else {
          console.log(error);
        }
      });
    };

    $scope.createUser = function (user) {

      FirebaseRef.createUser({
        email    : user.email,
        password : user.password
      }, function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
        }
      });

    }

  });
