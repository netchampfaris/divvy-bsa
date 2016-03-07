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
    $scope.chats = {};
    // $scope.chats = $localStorage.userChats;
    FirebaseRef.child('users/'+$localStorage.authData.uid+'/chats').once('value')
      .then(function(snap){
        $scope.chats = snap.val();
        $scope.$apply('chats');
      });

    $scope.startChat = function (key, chat) {
      // console.log(key, chat);
      $state.go('userChat', {
        key: key,
        recipientName: chat.recipientName,
        recipientImg: chat.recipientImg
      });
    };

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

  });
