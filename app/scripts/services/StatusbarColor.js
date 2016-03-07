'use strict';

/**
 * @ngdoc service
 * @name Divvy.StatusbarColor
 * @description
 * # StatusbarColor
 * Sets the statusbar color
 *
 */
angular.module('Divvy')
  .factory('StatusbarColor', function(Colors, $ionicPlatform) {

    var set = function (color) {
      $ionicPlatform.ready(function() {
        if (window.StatusBar) {
          if (ionic.Platform.isAndroid()) {
            StatusBar.backgroundColorByHexString(Colors.getHex(color));
          } else {
            StatusBar.styleLightContent();
          }
        }
      });
    };

    return {
      set: set
    };

  });
