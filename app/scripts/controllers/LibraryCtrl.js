'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:LibraryCtrl
 * @description
 * # LibraryCtrl
 */
angular.module('Divvy')
  .controller('LibraryCtrl', function($scope, $state) {

    console.log('in library');
    $scope.platform = ionic.Platform.platform();

    $scope.books = [

      {
        title: "Mobile Communications",
        author: "Jochen Schiller"
      },
      {
        title: "Digital Logic",
        author: "James Mathew"
      },
      {
        title: "Mathematics IV",
        author: "Kumbhojkar"
      }
    ];

    $scope.addbook = function() {

      $state.go('tab.addbook');
    }

  });
