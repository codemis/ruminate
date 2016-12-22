'use strict';

angular.module('ruminate', ['ionic', 'ngCordova', 'app.controllers', 'app.models', 'app.libraries', 'dbp.services', 'monospaced.elastic', 'config', 'api-tokens.config'])

.run(['$ionicPlatform', function($ionicPlatform) {
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
  });
}])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  /**
   * Hide the text on the back button
   */
  $ionicConfigProvider.backButton.text('').icon('ion-chevron-left').previousTitleText(false);
  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $stateProvider

  // setup an abstract state for the tabs directive
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('app.home', {
    url: '/home',
    views: {
      'app-home': {
        templateUrl: 'templates/rumination.html',
        controller: 'RuminationController'
      }
    }
  })

  .state('app.history', {
    url: '/history',
    views: {
      'app-history': {
        templateUrl: 'templates/tab-history.html',
        controller: 'HistoryController'
      }
    }
  })

  .state('app.rumination', {
    url: '/rumination/:ruminationId',
    views: {
      'app-history': {
        templateUrl: 'templates/rumination.html',
        controller: 'RuminationController'
      }
    }
  })

  .state('app.chapter-select', {
    url: '/home/chapter-select',
    views: {
      'app-home':{
        templateUrl: 'templates/view-chapter-select.html',
        controller: 'ChapterSelectController'
      }
    }
  })
  .state('app.verse-select', {
    url: '/home/verse-select/:damId/:bookId/:chapter',
    views: {
      'app-home':{
        templateUrl: 'templates/view-verse-select.html',
        controller: 'VerseSelectController'
      }
    }
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'app-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsController'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');

});
