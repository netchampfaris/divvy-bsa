'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:UserProfileCtrl
 * @description
 * # UserProfileCtrl
 */
angular.module('Divvy')
  .controller('UserProfileCtrl', ['$scope', '$stateParams', 'GetUserProfile', 'UserBooks', '$state', function($scope, $stateParams, GetUserProfile, UserBooks, $state) {

    console.log('in userProfile');

//    console.log($stateParams.uid);

    $scope.user = {};
    $scope.userBooks = {};
    $scope.loading = {
      user: true,
      userBooks: true
    };

    GetUserProfile($stateParams.uid).then(function(data){
//      console.log(data);
      $scope.user = data;
      $scope.loading.user = false;
    });

    UserBooks.get($stateParams.uid).then(function (userBooks) {
      $scope.userBooks = userBooks;
//      console.log(userBooks);
      $scope.loading.userBooks = false;
    }, function (err) {
      console.log(err);
    });

    $scope.shareInfo = function(info){

      if(info.isShared){
        if(info.shareType == 'sell'){
          return 'Selling Price: '+info.sellPrice;
        }
        else if(info.shareType == 'rent'){
          return 'Rent: '+info.rentPrice+', Deposit: '+info.rentDeposit;
        }
      }
      else{
        return 'Not shared';
      }

    };

    $scope.openBookDetails = function (isbn) {
      $state.go('tab.bookview', {isbn: isbn});
    };


    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

  }]);
