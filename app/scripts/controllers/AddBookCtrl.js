'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:AddBookCtrl
 * @description
 * # AddBookCtrl
 */
angular.module('Divvy')
  .controller('AddBookCtrl', function($scope, GoogleBookService, $cordovaBarcodeScanner, $ionicPopup) {

    $scope.searchResults = {};
    $scope.addbook = function(searchTerms) {
      GoogleBookService.getEndpoint(searchTerms).then(function(data){
        $scope.searchResults = data.data;
        console.log(data.data);
      });
    };

    $scope.scan = function() {

      if(window.cordova){
        $cordovaBarcodeScanner
          .scan()
          .then(function(barcodeData) {
            // Success! Barcode data is here
            console.log(barcodeData);
            $ionicPopup.alert({title: "Found", template: barcodeData.text});
          }, function(error) {
            // An error occurred
            console.log(error);
          });
      }

    }

  });
