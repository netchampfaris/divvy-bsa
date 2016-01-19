'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:LibraryCtrl
 * @description
 * # LibraryCtrl
 */
angular.module('Divvy')
  .controller('LibraryCtrl', function($scope, $state, books) {

    console.log('in library');
    $scope.platform = ionic.Platform.platform();

    $scope.librarybooks = books.userbooks;
    console.log($scope.librarybooks);

    $scope.addbook = function() {

      $state.go('tab.addbook');
    }

  });
