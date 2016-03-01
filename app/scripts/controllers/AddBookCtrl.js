'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:AddBookCtrl
 * @description
 * # AddBookCtrl
 */
angular.module('Divvy')
  .controller('AddBookCtrl', function($scope, $rootScope, GoogleBookService, $cordovaBarcodeScanner, $ionicPopup, $ionicModal, appModalService) {

    $scope.searchResults = [];

    $scope.scan = function() {

      if(window.cordova){
        $cordovaBarcodeScanner
          .scan()
          .then(function(barcodeData) {
            // Success! Barcode data is here
            console.log(barcodeData);
            //$ionicPopup.alert({title: "Found", template: barcodeData.text});
            $scope.searchbook(barcodeData.text);
          }, function(error) {
            // An error occurred
            console.log(error);
          });
      }

    };

    $scope.search = {
      index: 0
    };

    $scope.searchbook = function(searchTerms, caller) {
      if(caller == 'button'){
        $rootScope.$broadcast('loading:show');
        $scope.searchResults = [];
        $scope.search.index = 0;
      }
      GoogleBookService.getEndpoint(searchTerms, $scope.search.index).then(function(data){
        $scope.searchResults = $scope.searchResults.concat(data.data.items);
        console.log($scope.searchResults);
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $scope.search.index += 10;
        $rootScope.$broadcast('loading:hide');
      });
    };


    $ionicModal.fromTemplateUrl('templates/library/add-book-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.modal = modal;
    });

    $scope.addbook = function (item) {

      var book = {
        title: item.volumeInfo.title,
        subtitle: item.volumeInfo.subtitle || null,
        authors: item.volumeInfo.authors || null,
        description: item.volumeInfo.description || null,
        publisher: item.volumeInfo.publisher || null,
        publishedDate: item.volumeInfo.publishedDate || null,
        pageCount: item.volumeInfo.pageCount || null,
        categories: item.volumeInfo.categories || null,
        imageLinks: item.volumeInfo.imageLinks || null,
        language: item.volumeInfo.language || null
      };

      /*convert nested isbn identifiers to linear*/
      var ii = item.volumeInfo.industryIdentifiers;
      for(var i in ii)
      {
        var isbntype = ii[i]['type'];
        var isbn = ii[i]['identifier'];

        book[isbntype] = isbn;
      }

      var userBook = {
        status: 'reading'
      };

      var params = {
        book: book,
        userBook: userBook
      };

      appModalService
        .show('templates/library/add-book-modal.html', 'ModalCtrl as vm', params)
        .then(function(result){
          console.log(result);
        }, function (error) {
          console.log(error);
        });
    }

  });
