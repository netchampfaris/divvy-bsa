'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:BookViewCtrl
 * @description
 * # BookViewCtrl
 */
angular.module('Divvy')
  .controller('BookViewCtrl', function($scope, FirebaseRef, $ionicLoading, $state, $localStorage, BookInfo, $stateParams, _, $ionicPopup) {

    $scope.book = {};
    $scope.owners = {};
    $scope.reviews = {};
    var isbn = $stateParams.isbn;

    $scope.isEmpty = function(item) {
      if (item.length === 0) {
        return false;
      }
      return _.isEmpty(item);
    };

    BookInfo.getBookDetails(isbn)
      .then(function(data) {
        $scope.book = data;
      });

    BookInfo.getBookOwners(isbn)
      .then(function(data) {
        $scope.owners = data;
      });

    BookInfo.getBookReviews(isbn)
      .then(function(data) {
        $scope.reviews = data;
      });

    $scope.toggleDesc = function(desc) {
      $scope.book.descLimit = (desc === 98) ? null : 98;
    };

    $scope.pricingInfo = function(userPref) {
      if (userPref.shareType === 'sell') {
        return 'Buy for ' + userPref.sellPrice + '/-';
      } else if (userPref.shareType === 'rent') {
        return 'Rent on ' + userPref.rentPrice + '/day with ' + userPref.rentDeposit + ' deposit';
      }
    };

    $scope.startChat = function(user) {
      console.log('here');
      $state.go('userChat', {
        chatFrom: $localStorage.authData.uid,
        chatTo: user.uid
      });
    };

    $scope.addReview = function() {

      $scope.data = {
        user: $localStorage.authData.uid,
        img: $localStorage.userInfo.img,
        date: Firebase.ServerValue.TIMESTAMP,
        rating: 3
      };

      $scope.rating = {
        max: 5
      };

      var myPopup = $ionicPopup.show({
        templateUrl: 'templates/search/review-popup.html',
        title: 'Add a review',
        subTitle: 'Please tell us about your experience',
        scope: $scope,
        cssClass: 'review-popup',
        buttons: [{
          text: 'Cancel'
        }, {
          text: '<b>Save</b>',
          type: 'button-assertive',
          onTap: function(e) {
            if (!$scope.data.title) {
              //don't allow the user to close unless he enters wifi password
              e.preventDefault();
            } else {
              return $scope.data;
            }
          }
        }]
      });

      myPopup.then(function(review) {
        console.log('Tapped!', review);

        FirebaseRef.child('reviews/'+isbn).push(review, function(err) {
          if(!err) {
            BookInfo.getBookReviews(isbn)
              .then(function(data) {
                $scope.reviews = data;
              });
          }
        });
      });
    };

  });
