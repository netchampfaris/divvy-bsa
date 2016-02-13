'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:BookViewCtrl
 * @description
 * # BookViewCtrl
 */
angular.module('Divvy')
  .controller('BookViewCtrl', function($scope, FirebaseUrl, $ionicLoading, bookinfo) {

    $scope.book = bookinfo.book;
    $scope.owners = bookinfo.bookowners;
    console.log(bookinfo);

    $scope.toggleDesc = function (desc) {
      $scope.book.descLimit = (desc == 98) ? null : 98;
    }

    $scope.pricingInfo = function(share) {
      if(share.type == 'sell')
        return 'Buy for '+share.sell.price+'/-';
      else if(share.type == 'rent')
        return 'Rent on '+share.rent.price+'/day with '+share.rent.deposit+' deposit';
    }

  });
