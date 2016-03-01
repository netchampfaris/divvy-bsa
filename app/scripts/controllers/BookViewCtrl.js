'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:BookViewCtrl
 * @description
 * # BookViewCtrl
 */
angular.module('Divvy')
  .controller('BookViewCtrl', function($scope, FirebaseUrl, $ionicLoading, bookinfo, $state, $localStorage) {

    $scope.book = bookinfo.book;
    $scope.owners = bookinfo.bookowners;

    $scope.toggleDesc = function (desc) {
      $scope.book.descLimit = (desc == 98) ? null : 98;
    };

    $scope.pricingInfo = function(userPref) {
      if(userPref.shareType == 'sell')
        return 'Buy for '+userPref.sellPrice+'/-';
      else if(userPref.shareType == 'rent')
        return 'Rent on '+userPref.rentPrice+'/day with '+userPref.rentDeposit+' deposit';
    };

    $scope.startChat = function (user) {
      console.log('here');
      $state.go('userChat', {
        chatFrom: $localStorage.authData.uid,
        chatTo: user.uid
      });
    }

  });
