'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:ModalCtrl
 * @description
 * # ModalCtrl
 */
angular.module('Divvy')
  .controller('ModalCtrl', function($scope, parameters, $rootScope, FirebaseRef, $ionicLoading, $q, $localStorage) {
    var vm = this;
    vm.book = parameters.book;
    $scope.userBook = parameters.userBook;
    console.log(vm.book);
    console.log($scope.userBook);

    $scope.add = function (userBook) {
      var valid = false;
      if(userBook.share)
      {
        if(userBook.share.option)
        {
          if(userBook.share.type)
          {
            if(userBook.share.type == 'sell')
            {
              if(userBook.share.sell && userBook.share.sell.price){
                valid = true;
              }
            }
            if(userBook.share.type == 'rent')
            {
              if(userBook.share.rent && userBook.share.rent.price && userBook.share.rent.deposit){
                valid = true;
              }
            }
          }
        }
        else
        {
          userBook.share = null;
          valid = true;
        }
      }
      else valid = true;

      if(valid)
      {
        $rootScope.confirmPopup(
          'Confirm submit',
          'Are you sure to add this book information?',
          'Add book',
          'assertive'
        ).then(function (res) {
          if(res){
            console.log('yes');
            $ionicLoading.show();
            addUserData(userBook).then(function () {
              $ionicLoading.hide();
              $scope.closeModal($scope.userBook);
            });
          }
          else
            console.log('no');
        });
      }

      function addUserData(userBook) {
        var defer = $q.defer();
        FirebaseRef.child('books/'+vm.book.ISBN_13 || vm.book.ISBN_10).update(vm.book, function () {
          FirebaseRef.child('users/'+$localStorage.authData.uid+'/books/'+vm.book.ISBN_13 || vm.book.ISBN_10).update(userBook, function () {
            defer.resolve();
          });
        });
        return defer.promise;
      }
    };

    $scope.close = function () {

    }

  });
