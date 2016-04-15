'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:FeaturedCtrl
 * @description
 * # FeaturedCtrl
 */
angular.module('Divvy')
  .controller('FeaturedCtrl', ['$scope', '$state', 'GetBooks',function($scope, $state, GetBooks) {

    console.log('in featured');
    $scope.items = {};
    $scope.loading = true;

    GetBooks.all()
      .then(function(items){
        $scope.items = items;
        $scope.loading = false;
        // console.log($scope.items);
      });

    $scope.bookview = function (id) {
      $state.go('tab.bookview', { isbn: id });
    };

  }]);
