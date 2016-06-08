'use strict';

var appControllers = angular.module('app.controllers');

appControllers.controller('PassageController', ['$scope', '$stateParams', '$ionicPlatform', '$cordovaNetwork', 'BibleAccessor', 'onDeviceService', 'ConsumerService', 'RuminationService', function($scope, $stateParams, $ionicPlatform, $cordovaNetwork, BibleAccessor, onDeviceService, ConsumerService, RuminationService){
  /**
   * The Rumination to look up a passage for
   *
   * @type {Rumination}
   */
  $scope.rumination = null;
  /**
   * The current Consumer
   *
   * @type {Consumer}
   */
  $scope.consumer = null;
  $scope.ruminationId = $stateParams.ruminationId;

  $ionicPlatform.ready(function() {
    /**
     * Handle online/offline access
     */
    if(onDeviceService.check()) {
      $scope.apiAccessible = $cordovaNetwork.isOnline();
    }
    /**
     * Watch for events that are broadcasted
     */
    $scope.$on('$cordovaNetwork:online', function() {
      $scope.apiAccessible = true;
      setup();
    });

    $scope.$on('$cordovaNetwork:offline', function() {
      $scope.apiAccessible = false;
      teardown();
    });

    $scope.$on('$ionicView.enter', function() {
      setup();
    });

    $scope.$on('$ionicView.leave', function() {
      teardown();
    });

    $scope.$on('$destroy', function() {
      teardown();
    });

  });

  /**
   * Setup the controller
   *
   * @access private
   */
  function setup() {
    ConsumerService.getCurrent().then(function(consumer) {
      $scope.consumer = consumer;
      RuminationService.findById(consumer.apiKey, $scope.ruminationId).then(function(rumination) {
        $scope.rumination = rumination;
        BibleAccessor.getVerses(BibleAccessor.bookDamMap[rumination.passage.first.abbreviation], rumination.passage.first.abbreviation, rumination.passage.first.chapter, function(verses) {
          $scope.verses = verses.slice($scope.rumination.passage.first.verse - 1, $scope.rumination.passage.last.verse);
        });
      });
    });
  }

  /**
   * Teardown the controller
   *
   * @access private
   */
  function teardown() {
  }

}]);
