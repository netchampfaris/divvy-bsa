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
    vm.book.descLimit = 98;
    $scope.userBook = parameters.userBook;
    console.log('in modal');
    if($localStorage.userBooks == null){
      $localStorage.userBooks = {};
    }

    $scope.toggleDesc = function (desc) {
      vm.book.descLimit = (desc == 98) ? null : 98;
    }

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
            addUserData(userBook).then(function (userBook) {
              $ionicLoading.hide();
              $scope.closeModal(userBook);
            });
          }
          else
            console.log('no');
        });
      }

      function addUserData(userBook) {
        var defer = $q.defer();
        var isbn = vm.book.ISBN_13 || vm.book.ISBN_10 || vm.book.OTHER;
        FirebaseRef.child('books/'+isbn).update(vm.book, function (error) {
          if(error) console.log(error);
          else
            FirebaseRef.child('users/'+$localStorage.authData.uid+'/books/'+isbn).update(userBook, function (err) {
              if(err) console.log(err);
              else{
                userBook.info = vm.book;
                $localStorage.userBooks[isbn] = {};
                $localStorage.userBooks[isbn] = userBook;
                console.log('updated db with book info',userBook);

                var bookowner = {};
                bookowner[$localStorage.authData.uid] = (userBook.share != null)? true : false; // true for shared, false for not shared
                FirebaseRef.child('bookowners/'+isbn).update(bookowner, function (e) {
                  if(e) console.log(e);
                  else {
                    defer.resolve($localStorage.userBooks[isbn]);
                    console.log('updated db with bookowner info');
                  }
                });
              }
            });
        });
        return defer.promise;
      }
    };

    $scope.close = function () {
      $scope.closeModal('modal cancelled');
    }

  });
