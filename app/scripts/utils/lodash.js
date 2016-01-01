'use strict';

/**
 * @ngdoc function
 * @name Divvy.util:lodash
 * @description
 * # Lo-Dash
 * Expose Lo-Dash through injectable factory, so we don't pollute / rely on global namespace
 * just inject lodash as _
 */

angular.module('Divvy')
  .factory('_', function($window) {
    return $window._;
  });
