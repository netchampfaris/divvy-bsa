'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:LibraryCtrl
 * @description
 * # LibraryCtrl
 */
angular.module('Divvy')
  .controller('LibraryCtrl', ['$scope', 'UserBooksLocal', 'appModalService', '$localStorage', '_', function($scope, UserBooksLocal, appModalService, $localStorage, _) {

    console.log('in library');

    $scope.loading = true;
    UserBooksLocal.get().then(function() {
      $scope.loading = false;
    });

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

    };

    $scope.atLeastOneBook = function () {
      return !(_.isEmpty($localStorage.userBooks));
    };

  }]);
