'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:UserChatCtrl
 * @description
 * # UserChatCtrl
 */
angular.module('Divvy')
  .controller('UserChatCtrl', function($scope, $ionicHistory, chatInfo, FirebaseRef, $firebaseArray,
                                       $localStorage, $ionicScrollDelegate, $timeout) {

    console.log('in user-chat');
    $scope.goBack = function () {
      $ionicHistory.goBack();
    };

    console.log(chatInfo);

    chatInfo.key = 'google:112573893399449675024_13190ef8-cf39-46e9-8c34-df7488399762';

    $scope.chatList = {};

    var chatList = $firebaseArray(FirebaseRef.child('chats/'+chatInfo.key));

    chatList.$loaded()
      .then(function (chatList) {
        $scope.chatList = chatList;
        console.log('chat initialized');
      })
      .catch(function (err) {
        console.log(err);
      });

    $scope.sendChat = function (message) {
      chatList.$add({
        sender: $localStorage.authData.uid,
        message: message,
        timestamp: Firebase.ServerValue.TIMESTAMP
      }).then(function (id) {
        console.log(id);
      });
      $scope.message = null;
      $ionicScrollDelegate.scrollBottom(true);
    };

    chatList.$watch(function(event) {

      $ionicScrollDelegate.scrollBottom();
      console.log(event);
    });

    $scope.imageUrl = function (user) {
      if(user == $localStorage.authData.uid)
        return chatInfo.senderImg;
      else
        return chatInfo.recipientImg;
    };

    $scope.name = function (user) {
      if(user == $localStorage.authData.uid)
        return chatInfo.senderName;
      else
        return chatInfo.recipientName;
    };

    $scope.avatarSide = function (user) {
      if(user == $localStorage.authData.uid)
        return 'item-avatar-right item-stable text-rtl';
      else
        return 'item-avatar-left';
    };

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

  });
