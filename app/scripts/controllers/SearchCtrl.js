'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:SearchCtrl
 * @description
 * # SearchCtrl
 */
angular.module('Divvy')
  .controller('SearchCtrl', function($scope, GoogleBookService) {

    console.log('in search');
    $scope.data = {};
    $scope.search = function (searchTerms) {

      console.log(searchTerms);
      GoogleBookService.getEndpoint(searchTerms).then(function(data){
        console.log(data);
        $scope.data = data;
      });
    }





  });
