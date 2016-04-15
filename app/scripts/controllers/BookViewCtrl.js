'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:BookViewCtrl
 * @description
 * # BookViewCtrl
 */
angular.module('Divvy')
  .controller('BookViewCtrl', ['$scope', 'FirebaseRef', '$ionicLoading', '$state', '$localStorage', 'BookInfo', '$stateParams', '_', '$ionicPopup',function($scope, FirebaseRef, $ionicLoading, $state, $localStorage, BookInfo, $stateParams, _, $ionicPopup) {

    $scope.book = {};
    $scope.owners = {};
    $scope.reviews = {};

    $scope.loading = {
      book: true,
      owners: true,
      reviews: true
    };
    var isbn = $stateParams.isbn;

    BookInfo.getBookDetails(isbn)
      .then(function(data) {
        $scope.book = data;
        $scope.loading.book = false;
      });

    BookInfo.getBookOwners(isbn)
      .then(function(data) {
        $scope.owners = data;
        $scope.loading.owners = false;
        console.log(data);
      });

    BookInfo.getBookReviews(isbn)
      .then(function(data) {
        $scope.reviews = data;
        $scope.loading.reviews = false;
      });

    $scope.toggleDesc = function(desc) {
      $scope.book.descLimit = (desc === 98) ? null : 98;
    };

    $scope.calcRating = function(rating) {
      if(rating){
        return rating.cumulativeRatings/rating.numRatings;
      }
      return 0;
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

    $scope.openProfile = function(id) {
      console.log('openProfile');
      $state.go('userProfile', {uid: id});
    };

    $scope.addReview = function() {

      $scope.data = {
        isbn: isbn,
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

      function pushReview(review) {
        return FirebaseRef.child('reviews').push(review);
      }
      function updateRating(rating) {
        return FirebaseRef.child('books/'+isbn+'/rating').transaction(function(snap){
          if(snap === null){
            return {
              numRatings: 1,
              cumulativeRatings: rating
            };
          }
          else {
            return {
              numRatings: parseInt(snap.numRatings) + 1,
              cumulativeRatings: parseInt(snap.cumulativeRatings) + rating
            };
          }
        });
      }

      myPopup.then(function(review) {
        console.log('Tapped!', review);
        $scope.loading.reviews = true;
        pushReview(review)
        .then(updateRating(review.rating))
        .then(function() {
          BookInfo.getBookReviews(isbn)
            .then(function(data) {
              $scope.reviews = data;
              $scope.loading.reviews = false;
            });
        });
      });
    };

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

  }]);
