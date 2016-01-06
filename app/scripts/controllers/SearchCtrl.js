'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:SearchCtrl
 * @description
 * # SearchCtrl
 */
angular.module('Divvy')
  .controller('SearchCtrl', function($scope) {

    console.log('in search');
    $scope.data = {};
    $scope.search = function (searchTerms) {
      console.log(searchTerms);
    }

  });
