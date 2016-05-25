'use strict';

var appControllers = angular.module('app.controllers');

appControllers.controller('HistoryController', ['$scope', '$ionicPlatform', '$cordovaNetwork', 'onDeviceService', 'ConsumerService', 'RuminationService', function($scope, $ionicPlatform, $cordovaNetwork, onDeviceService, ConsumerService, RuminationService) {
  /**
   * Is the API accessible
   *
   * @type {Boolean}
   * @access public
   */
  $scope.apiAccessible = true;
  /**
   * The current Consumer
   *
   * @type {Object}
   * @access public
   */
  $scope.consumer = null;
  /**
   * A group of Ruminations
   *
   * @type {Array}
   * @access public
   */
  $scope.ruminations = null;


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
      RuminationService.all(consumer.apiKey, 'createdAt|desc').then(function(ruminations) {
        $scope.ruminations = ruminations;
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
