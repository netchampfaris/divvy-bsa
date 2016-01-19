'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:LibraryCtrl
 * @description
 * # LibraryCtrl
 */
angular.module('Divvy')
  .controller('LibraryCtrl', function($scope, books, appModalService, $localStorage) {

    console.log('in library');

    $scope.$storage = $localStorage;

    $scope.editBook = function (book) {

      //using the same modal is awesome
      var userBook = {};
      userBook.status = book.status;
      userBook.share = book.share || null;
      var params = {
        book: book.info,
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
