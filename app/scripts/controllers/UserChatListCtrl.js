'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:UserChatListCtrl
 * @description
 * # UserChatListCtrl
 */
angular.module('Divvy')
  .controller('UserChatListCtrl', function($scope, $ionicHistory, FirebaseRef, $state, $localStorage) {

    console.log('in user-chat-list');
    $scope.goBack = function () {
      $ionicHistory.goBack();
    };
    $scope.chats = $localStorage.userChats;

    $scope.startChat = function (user) {
      $state.go('userChat', {
        chatFrom: $localStorage.authData.uid,
        chatTo: user
      });
    };


    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

  });
