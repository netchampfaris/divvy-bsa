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
  .factory('ChatInfo', ['$localStorage', 'FirebaseRef', '$q', function($localStorage, FirebaseRef, $q) {

    return {
      get: function (users) {

        var info     = {
          key: ''
        };

        if(users.chatFrom && users.chatTo){

          var chatFrom = users.chatFrom;
          var chatTo   = users.chatTo;
          console.log('in chatinfo');
          console.log(users);

          //generate chatKey, which will be same for two users
          info.key = (chatFrom > chatTo) ? chatFrom +'_'+ chatTo : chatTo +'_'+ chatFrom;
          console.log(info.key);

          $q.all([
            FirebaseRef.child('users/'+chatTo+'/name').once('value'),
            FirebaseRef.child('users/'+chatTo+'/img').once('value') ,
            FirebaseRef.child('users/'+chatFrom+'/chats/'+info.key).once('value'),
            FirebaseRef.child('users/'+chatTo+'/chats/'+info.key).once('value')
          ])
          .then(function (val) {
            info.recipientName = val[0].val();
            info.recipientImg  = val[1].val();
            info.senderName    = $localStorage.userInfo.name;
            info.senderImg     = $localStorage.userInfo.img;

            console.log('chat nodes ->', val[2].val(), val[3].val());
            if(val[2].val() === null && val[3].val() === null){
              console.log('new chat');

              $localStorage.userChats           = $localStorage.userChats || {};
              $localStorage.userChats[info.key] = {};
              $localStorage.userChats[info.key] = {
                recipientName: info.recipientName,
                recipientImg: info.recipientImg
              };

              return $q.all([
                FirebaseRef.child('users/'+chatFrom+'/chats/'+info.key).update({
                  recipientName: info.recipientName,
                  recipientImg:  info.recipientImg
                }),
                FirebaseRef.child('users/'+chatTo+'/chats/'+info.key).update({
                  recipientName: info.senderName,
                  recipientImg:  info.senderImg
                })
              ]);
              // return FirebaseRef.child('users/'+chatFrom+'/chats/'+info.key).update({
              //   recipientName: info.recipientName,
              //   recipientImg:  info.recipientImg
              // });
            }
            return 'this is false ->';
          })
          .then(function (response) {
            console.log(response, 'chatInfo added to user/chats');
          });
        }
        else if(users.key){
          info            = users;
          info.senderName = $localStorage.userInfo.name;
          info.senderImg  = $localStorage.userInfo.img;
        }
        return info;
      }
    };
  }]);
