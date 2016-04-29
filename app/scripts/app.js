'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ngCordova', 'app.controllers', 'app.models', 'app.libraries', 'parse.services', 'dbp.services', 'ionic.utilities', 'monospaced.elastic', 'config', 'api-tokens.config'])

.run(['$ionicPlatform', 'ParseService', 'PARSE_ENV', 'BibleAccessor', function($ionicPlatform, ParseService, PARSE_ENV, BibleAccessor) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
    ParseService.initialize(PARSE_ENV.appId, PARSE_ENV.clientId, PARSE_ENV.jSKey);
    BibleAccessor.updateBookMaps();
  });
}])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeController'
      }
    }
  })
  .state('tab.reflection', {
    url: '/home/reflection/:objId',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'HomeController'
      }
    }
  })

  .state('tab.history', {
    url: '/history',
    views: {
      'tab-history': {
        templateUrl: 'templates/tab-history.html',
        controller: 'HistoryController'
      }
    }
  })

  .state('tab.passage', {
    url: '/home/passage/:passageId',
    views: {
      'tab-home':{
        templateUrl: 'templates/tab-passage.html',
        controller: 'PassageController'
      }
    }
  })
  .state('tab.chapter-select', {
    url: '/home/chapter-select',
    views: {
      'tab-home':{
        templateUrl: 'templates/view-chapter-select.html',
        controller: 'ChapterSelectController'
      }
    }
  })
  .state('tab.verse-select', {
    url: '/home/verse-select/:damId/:bookId/:chapter',
    views: {
      'tab-home':{
        templateUrl: 'templates/view-verse-select.html',
        controller: 'VerseSelectController'
      }
    }
  })

  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsController'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
