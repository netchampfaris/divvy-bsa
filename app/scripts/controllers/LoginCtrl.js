'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:LoginCtrl
 * @description
 * # LoginCtrl
 */
angular.module('Divvy')
  .controller('LoginCtrl', function($scope, FirebaseRef, Auth, $localStorage, $state, $ionicLoading, $rootScope) {

    if($localStorage.authData)
    {
      $state.go('tab.featured');
      console.log('logged in as', $localStorage.authData.uid);
    }

    $scope.login = function(authMethod) {
      $ionicLoading.show();
      Auth.$authWithOAuthRedirect(authMethod).then(function(authData) {
        console.log('redirect logged in', authData);
        $ionicLoading.hide();
      }).then(function(data){
        console.log(data);
      }).catch(function(error) {
        if (error.code === 'TRANSPORT_UNAVAILABLE') {
          Auth.$authWithOAuthPopup(authMethod).then(function(authData) {
            console.log('logged in using',authMethod, authData);
            $localStorage.authData = authData;
            $ionicLoading.hide();
          });
        } else {
          console.log(error);
          $ionicLoading.hide();
        }
      });
    };

    $scope.createUser = function (user) {
      $ionicLoading.show();
      Auth.$createUser(user).then(function (authData) {
        console.log(authData);
        return Auth.$authWithPassword(user);
      }).then(function (authData) {
        console.log('Logged in as ', authData.uid);
        $ionicLoading.hide();
      }).catch(function (err) {
        console.log(err);
        $rootScope.alertPopup('Error', err);
        $ionicLoading.hide();
      });
    };

    $scope.emailLogin = function (user) {
      $ionicLoading.show();
      Auth.$authWithPassword(user).then(function (authData) {
        console.log('Logged in using email as ', authData.uid);
        $ionicLoading.hide();
      }).catch(function (err) {
        console.log(err);
        $rootScope.alertPopup('Error', err);
        $ionicLoading.hide();
      });
    }

  });
