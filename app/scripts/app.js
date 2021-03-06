'use strict';

/**
 * @ngdoc overview
 * @name Divvy
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */


angular.module('Divvy', ['ionic', 'ngCordova', 'ngResource', 'ngStorage', 'firebase', 'ion-place-tools', 'ionic.rating'])

  .run(['$ionicPlatform', '$ionicLoading', '$rootScope', 'Auth', '$localStorage', '$state', '$ionicPopup', 'FirebaseRef', 'appModalService', '$q', 'StatusbarColor', function($ionicPlatform, $ionicLoading, $rootScope, Auth, $localStorage, $state, $ionicPopup, FirebaseRef, appModalService, $q, StatusbarColor) {

    $ionicPlatform.ready(function() {

      //Setting up OneSignal
      // Enable to debug issues.
      // window.plugins.OneSignal.setLogLevel({logLevel: 4, visualLevel: 4});

      if(window.cordova){

        var notificationOpenedCallback = function(jsonData) {
          console.log('didReceiveRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
        };

        window.plugins.OneSignal.init('54b3e879-1540-4ceb-b1e8-d3968dcc188b',
        {googleProjectNumber: '1008005019764'},
        notificationOpenedCallback);

        // Show an alert box if a notification comes in when the user is in your app.
        window.plugins.OneSignal.enableInAppAlertNotification(true);
      }

      //color
      StatusbarColor.set('energized');

      //Fires when user logs in or logs out
      Auth.$onAuth(function(authData) {
        if (authData === null) {
          console.log('Not logged in yet');
          delete $localStorage.authData;
          delete $localStorage.userBooks;
          delete $localStorage.userInfo;
          $state.go('login');
        } else {
          // console.log(authData);
          console.log('Logged in as', authData.uid);
          $localStorage.authData = authData;
          FirebaseRef.child('users/'+authData.uid+'/name').once('value')
            .then(function (data) {
              if(data.val() === null){

                  var params = {
                    name: authData[authData.provider].displayName,
                    img: authData[authData.provider].profileImageURL,
                    location: null
                  };
                  appModalService
                  .show('templates/user/user-info.html', 'UserInfoCtrl', params)
                  .then(function(result){
                    console.log(result);
                  }, function (error) {
                    console.log(error);
                  });

              }
              else{
                $q.all([
                  FirebaseRef.child('users/'+authData.uid+'/name').once('value'),
                  FirebaseRef.child('users/'+authData.uid+'/img').once('value'),
                  FirebaseRef.child('users/'+authData.uid+'/location').once('value')
                ])
                  .then(function (val) {
                    $localStorage.userInfo = {
                      name: val[0].val(),
                      img: val[1].val(),
                      location: val[2].val()
                    };
                    console.log('fetched userInfo');
                  });
              }
              if(window.cordova){
                window.plugins.OneSignal.getIds(function(ids) {
                  console.log('getIds: ' + JSON.stringify(ids));
                  FirebaseRef.child('users/'+authData.uid).update({
                    appId: ids.userId
                  });
                });
              }
          });
          $state.go('tab.featured');
        }
      });

      $rootScope.logout = function () {
        $rootScope.confirmPopup('Logout ?','','Logout', 'assertive').then(function (res) {
          if(res){
            Auth.$unauth();
          }
        });
      };
    });


    $rootScope.confirmPopup = function (title, message, okText, okColor) {
      return $ionicPopup.confirm({
        title: title,
        template: message,
        okType: 'button-' + okColor,
        okText: okText
      });
    };

    $rootScope.alertPopup = function (title, message) {
      return $ionicPopup.alert({
        title:title,
        template:message
      });
    };

    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      // We can catch the error thrown when the $requireAuth promise is rejected
      // and redirect the user back to the home page
      if (error === 'AUTH_REQUIRED') {
        $state.go('login');
      }
    });

    // add possible global event handlers here
    $rootScope.$on('loading:show', function() {
      $ionicLoading.show();
    });

    $rootScope.$on('loading:hide', function() {
      $ionicLoading.hide();
    });

    $rootScope.$on('$stateChangeStart', function () {
      $ionicLoading.show();
    });

    $rootScope.$on('$stateChangeSuccess', function () {
      $ionicLoading.hide();
    });

  }])

  .config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',function($httpProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    // register $http interceptors, if any. e.g.
    // $httpProvider.interceptors.push('interceptor-name');

    // Application routing
    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'templates/login/login.html',
        controller: 'LoginCtrl',
        resolve: {
          'currentAuth': function (Auth) {
            return Auth.$waitForAuth();
          }
        }
      })

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html',
        resolve: {
          'currentAuth': function (Auth) {
            return Auth.$requireAuth();
          }
        }
      })

      // Each tab has its own nav history stack:

      .state('tab.library', {
        url: '/library',
        cache: false,
        views: {
          'tab-library': {
            templateUrl: 'templates/library/tab-library.html',
            controller: 'LibraryCtrl'
          }
        }
      })

      .state('tab.addbook', {
        url: '/library/addbook',
        cache: false,
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
      })

      .state('tab.bookview', {
        url: '/search/book',
        views: {
          'tab-search': {
            templateUrl: 'templates/search/tab-search-bookview.html',
            controller: 'BookViewCtrl'
          }
        },
        params: {
          isbn: null
        }
      })

      .state('userChat', {
        url: '/userChat',
        cache: false,
        templateUrl: 'templates/user/user-chat.html',
        controller: 'UserChatCtrl',
        params: {
          chatFrom: null,
          chatTo: null,
          key: null,
          recipientName: null,
          recipientImg: null
        },
        resolve: {
          'chatInfo' : function($stateParams, ChatInfo) {
            return ChatInfo.get($stateParams);
          }
        }
      })

      .state('userChatList', {
        url: '/userChatList',
        cache: false,
        templateUrl: 'templates/user/user-chat-list.html',
        controller: 'UserChatListCtrl'
      })

      .state('userProfile', {
        url: '/userProfile',
        templateUrl: 'templates/user/user-profile.html',
        controller: 'UserProfileCtrl',
        params: {
          uid: null
        }
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

    $ionicConfigProvider.scrolling.jsScrolling(false);

    //show loading indicators before $http request
    /*$httpProvider.interceptors.push(function($rootScope) {
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
    });*/
  }]);
