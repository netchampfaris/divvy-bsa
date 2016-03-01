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
      var params = {
        book: book.info,
        userBook: book.userBook
      };

      appModalService
        .show('templates/library/add-book-modal.html', 'ModalCtrl as vm', params)
        .then(function(result){
          console.log(result);
        }, function (error) {
          console.log(error);
        });
    };

    $scope.openUserProfile = function() {
      var params = _.cloneDeep($localStorage.userInfo);

      appModalService
        .show('templates/user/user-info.html', 'UserInfoCtrl', params)
        .then(function(result){
          console.log(result);
        }, function (error) {
          console.log(error);
        });

    }

    $scope.atLeastOneBook = function () {
      return !(_.isEmpty($localStorage.userBooks));
    }

  });
