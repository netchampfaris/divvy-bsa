'use strict';

/**
 * @ngdoc overview
 * @name Divvy
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */


angular.module('Divvy', ['ionic', 'ngCordova', 'ngResource', 'ngStorage', 'firebase'])

  .run(function($ionicPlatform, $ionicLoading, $rootScope, Auth, $localStorage, $state, $ionicPopup) {

    $ionicPlatform.ready(function() {
      // save to use plugins here
    });

    Auth.$onAuth(function(authData) {
      if (authData === null) {
        console.log('Not logged in yet');
        delete $localStorage.authData;
        $state.go('login');
      } else {
        console.log('Logged in as', authData.uid);
        $localStorage.authData = authData;
        $state.go('tab.featured');
      }
    });


    $rootScope.confirmPopup = function (title, message, okText, okColor) {
      return $ionicPopup.confirm({
        title: title,
        template: message,
        okType: 'button-' + okColor,
        okText: okText
      });
    };

    // add possible global event handlers here
    $rootScope.$on('loading:show', function() {
      $ionicLoading.show();
    });

    $rootScope.$on('loading:hide', function() {
      $ionicLoading.hide();
    });

    $rootScope.$on('$stateChangeStart', function () {
      $rootScope.$broadcast('loading:show');
      console.log('please wait...');
    });

    $rootScope.$on('$stateChangeSuccess', function () {
      $rootScope.$broadcast('loading:hide');
      console.log('done');
    });

  })

  .config(function($httpProvider, $stateProvider, $urlRouterProvider) {
    // register $http interceptors, if any. e.g.
    // $httpProvider.interceptors.push('interceptor-name');

    // Application routing
    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login/login.html',
        controller: 'LoginCtrl'
      })

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
      })

      // Each tab has its own nav history stack:

      .state('tab.library', {
        url: '/library',
        views: {
          'tab-library': {
            templateUrl: 'templates/library/tab-library.html',
            controller: 'LibraryCtrl'
          }
        }
      })

      .state('tab.addbook', {
        url: '/library/addbook',
        views: {
          'tab-library': {
            templateUrl: 'templates/library/add-book.html',
            controller: 'AddBookCtrl'
          }
        }
      })

      .state('tab.featured', {
        url: '/featured',
        views: {
          'tab-featured': {
            templateUrl: 'templates/featured/tab-featured.html',
            controller: 'FeaturedCtrl'
          }
        }
      })


      .state('tab.search', {
        url: '/search',
        views: {
          'tab-search': {
            templateUrl: 'templates/search/tab-search.html',
            controller: 'SearchCtrl'
          }
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

    //show loading indicators before $http request
    $httpProvider.interceptors.push(function($rootScope) {
      return {
        request: function(config) {
          $rootScope.$broadcast('loading:show');
          return config;
        },
        response: function(response) {
          $rootScope.$broadcast('loading:hide');
          return response;
        }
      }
    });
  });


