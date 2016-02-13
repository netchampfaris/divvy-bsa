'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:UserInfoCtrl
 * @description
 * # UserInfoCtrl
 */
angular.module('Divvy')
  .controller('UserInfoCtrl', function($scope, parameters, $q, $localStorage, FirebaseRef) {

    console.log('in userinfo modal');

    $scope.userInfo = {
      name: parameters.name,
      location: null
    }

    $scope.locationSelected = function (locString) {
      latlon(locString).then(function (coords) {
        $scope.userInfo.location = {
          name: locString,
          coords: coords
        }
        console.log($scope.userInfo);
      });
    };

    function latlon(data) {
      var q = $q.defer();
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        address: data
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var result = {};
          result.lat = results[0].geometry.location.lat();
          result.lng = results[0].geometry.location.lng();
          q.resolve(result);
        } else {
          q.reject();
        }
      });
      return q.promise;
    }

    $scope.save = function(userInfo){
      if(userInfo.location)
        FirebaseRef.child('users/'+$localStorage.authData.uid).update(userInfo, function (err) {
          if(err) console.log(err);
          else $scope.closeModal('userinfo modal closed');
        });
    }


  });
