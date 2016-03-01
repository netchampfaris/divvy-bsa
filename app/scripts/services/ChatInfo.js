'use strict';

/**
 * @ngdoc service
 * @name Divvy.ChatInfo
 * @description
 * # ChatInfo
 * Gets chat info for two users
 *
 */
angular.module('Divvy')
  .factory('ChatInfo', function($localStorage, FirebaseRef, $q) {

    return {
      get: function (users) {

        var chatFrom = users.chatFrom;
        var chatTo = users.chatTo;
        var info = {
          key: ''
        };
        console.log('in chatinfo');

        if(chatFrom > chatTo)
          info.key = chatFrom +'_'+ chatTo;
        else
          info.key = chatTo +'_'+ chatFrom;

        $q.all([
          FirebaseRef.child('users/'+chatTo+'/name').once('value'),
          FirebaseRef.child('users/'+chatTo+'/img').once('value'),
          FirebaseRef.child('users/'+chatFrom+'/chats/'+info.key).once('value')
        ])
          .then(function (val) {
            info.recipientName = val[0].val();
            info.recipientImg = val[1].val();
            info.senderName = $localStorage.userInfo.name;
            info.senderImg = $localStorage.userInfo.img;

            console.log(val[2].val());
            if(val[2].val() == null){
              console.log('new chat');

              $localStorage.userChats = $localStorage.userChats || {};
              $localStorage.userChats[info.key] = {};
              $localStorage.userChats[info.key] = {
                recipientName: info.recipientName,
                recipientImg: info.recipientImg
              };

              return FirebaseRef.child('users/'+chatFrom+'/chats/'+info.key).update({
                recipientName: info.recipientName,
                recipientImg: info.recipientImg
              });
            }
            return 'this is false ->';
          })
          .then(function (response) {
            console.log(response, 'chatInfo added to user/chats');
          });

        return info;

      }
    }

  });

