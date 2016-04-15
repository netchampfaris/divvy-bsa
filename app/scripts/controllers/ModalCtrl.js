'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:ModalCtrl
 * @description
 * # ModalCtrl
 */
angular.module('Divvy')
  .controller('ModalCtrl', ['$scope', 'parameters', '$rootScope', 'FirebaseRef', '$ionicLoading', '$q', '$localStorage', function($scope, parameters, $rootScope, FirebaseRef, $ionicLoading, $q, $localStorage) {
    var vm = this;
    vm.book = parameters.book;
    vm.book.descLimit = 98;

    var userBook = _.cloneDeep(parameters.userBook);
    $scope.userBook = userBook;

    console.log('in modal');
    if($localStorage.userBooks == null){
      $localStorage.userBooks = {};
    }

    $scope.toggleDesc = function (desc) {
      vm.book.descLimit = (desc == 98) ? null : 98;
    };

    $scope.resetRent = function (userBook) {
      userBook.rentPrice = userBook.rentDeposit = null;
    };
    $scope.resetSell = function (userBook) {
      userBook.sellPrice = null;
    };
    $scope.resetUserBook = function (userBook) {
      userBook.shareType = null;
      $scope.resetRent(userBook);
      $scope.resetSell(userBook);

      if(userBook.isShared)
        userBook.shareType = 'sell';
    };


    $scope.isValidInput = function(userBook) {
      if(!userBook.isShared)  //if not shared, we dont need sell or rent input
        return true;
      else{
        if(userBook.shareType == 'sell' && userBook.sellPrice)  //if sell, then price is needed
          return true;
        else if(userBook.shareType == 'rent' && userBook.rentPrice && userBook.rentDeposit) //if rent, then price, deposit is needed
          return true;
      }
      return false;
    };

    $scope.add = function (userBook) {
      console.log(userBook);

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
          }, function (err) {
            $rootScope.alertPopup('Error', err);
          });
        }
        else
          console.log('no');
      });


      function addBook(isbn, book) {
        return FirebaseRef.child('books/'+isbn).update(book);
      }

      function updateUserInfo(uid, isbn, userBook) {
        return FirebaseRef.child('users/'+uid+'/books/'+isbn).update(userBook);
      }

      function  updateBookOwner(isbn, bookowner) {
        return FirebaseRef.child('bookowners/'+isbn).update(bookowner);
      }

      function addUserData(userBook) {
        var defer = $q.defer();
        var isbn = vm.book.ISBN_13 || vm.book.ISBN_10 || vm.book.OTHER;
        var bookowner = {};
        bookowner[$localStorage.authData.uid] = userBook.isShared || false; // true for shared, false for not shared

        $q.all([
          addBook(isbn, vm.book),
          updateUserInfo($localStorage.authData.uid, isbn, userBook),
          updateBookOwner(isbn, bookowner)
        ])
          .then(function () {
            var userBookInfo = {
              info: vm.book,
              userBook: userBook
            };
            $localStorage.userBooks[isbn] = {};
            $localStorage.userBooks[isbn] = userBookInfo;
            console.log('updated db with book info',userBookInfo);
            defer.resolve($localStorage.userBooks[isbn]);
          }).catch(function (err) {
          console.log(err);
          defer.reject(err);
        });
        return defer.promise;
      }
    };

    $scope.close = function () {
      $scope.closeModal('modal cancelled');
    };

  }]);
