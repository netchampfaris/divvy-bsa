'use strict';

/**
 * @ngdoc function
 * @name Divvy.controller:FeaturedCtrl
 * @description
 * # FeaturedCtrl
 */
angular.module('Divvy')
  .controller('FeaturedCtrl', function($scope) {

    console.log('in featured');

    $scope.items = [
      {
        title: "Mobile Communications",
        author: "Jochen Schiller",
        owner: "Akshay Dalvi",
        location: "Andheri"
      },
      {
        title: "Digital Logic",
        author: "James Mathew",
        owner: "Yash Mhatre",
        location: "Dombivali"
      },
      {
        title: "Mathematics IV",
        author: "Kumbhojkar",
        owner: "Faris Ansari",
        location: "Kurla"
      }
    ];
  });
