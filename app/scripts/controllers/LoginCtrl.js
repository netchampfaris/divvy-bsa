'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:LoginCtrl
 * @description
 * # LoginCtrl
 */
angular.module('Divvy')
  .controller('LoginCtrl', function($scope, FirebaseRef, Auth, $localStorage, $state, $ionicLoading) {

    if($localStorage.authData)
    {
      $state.go('tab.featured');
    }

    $scope.login = function(authMethod) {

      $ionicLoading.show();
      Auth.$authWithOAuthRedirect(authMethod).then(function(authData) {
        if(authData) $state.go('tab.featured');
        $ionicLoading.hide();
      }).catch(function(error) {
        if (error.code === 'TRANSPORT_UNAVAILABLE') {
          Auth.$authWithOAuthPopup(authMethod).then(function(authData) {
            if(authData) $state.go('tab.featured');
            $ionicLoading.hide();
          });
        } else {
          console.log(error);
          $ionicLoading.hide();
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
