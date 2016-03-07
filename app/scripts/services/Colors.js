'use strict';

/**
 * @ngdoc service
 * @name Divvy.Colors
 * @description
 * # Colors
 * App UI colors
 *
 */
angular.module('Divvy')
  .factory('Colors', function() {

    var colors = {
      energized: '#303F9F',
      positive:  '#3F51B5',
      stable:    '#f8f8f8',
      light:     '#FFFFFF',
      assertive: '#FF5722',
      balanced:  '#B32B00',
      dark:      '#212121',
      calm:      '#727272',
      royal:     '#B6B6B6'
    };

    var getHex = function (color) {
      return colors[color];
    };

    return {
      getHex: getHex
    };

  });
