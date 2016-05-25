'use strict';

var appControllers = angular.module('app.controllers');

appControllers.controller('HomeController', ['$scope', '$log', '$ionicPlatform', '$stateParams', '$location', '$interval', '$cordovaNetwork', 'onDeviceService', 'ConsumerService', 'RuminationService', function($scope, $log, $ionicPlatform, $stateParams, $location, $interval, $cordovaNetwork, onDeviceService, ConsumerService, RuminationService) {

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
   * The current Rumination
   *
   * @type {Object}
   * @access public
   */
  $scope.rumination = null;

  $scope.objId = $stateParams.objId;
  /**
   * Saving Interval for checking whether we need to push a save
   * @type {Object|Null}
   * @access private
   */
  var savingInterval = null;


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

    $scope.$on('PushNotify:pollPushStatusCompleted', function(event, data) {
      if ($scope.consumer !== null) {
        updatePushStatus(data.receivePush);
      }
    });

    $scope.$on('$ionicView.leave', function() {
      teardown();
    });

    $scope.$on('$destroy', function() {
      teardown();
    });

  });

  /**
   * Update the needs saving attribute
   *
   * @param  {Object} response The response that will need updated
   * @return {Void}
   * @access public
   */
  $scope.updateNeedsSaving = function(response) {
    response.needsSaving = true;
  };

  /**
   * Select a passage for Rumination
   *
   * @return {Void}
   * @access public
   */
  $scope.selectPassage = function() {
    $location.path('/tab/home/chapter-select');
  };

  /**
   * Setup the controller
   *
   * @access private
   */
  function setup() {
    ConsumerService.getCurrent().then(function(consumer) {
      $scope.consumer = consumer;
      RuminationService.today(consumer.apiKey).then(function(rumination) {
        $scope.rumination = rumination;
      });
      if (savingInterval === null) {
        savingInterval = $interval(function() {
          saveAllNotes();
        }, 5000);
      }
    });
  }

  /**
   * Teardown the controller
   *
   * @access private
   */
  function teardown() {
    $interval.cancel(savingInterval);
    savingInterval = null;
    saveAllNotes();
  }
  /**
   * Save all notes by sending it to Parse
   *
   * @return {Void}
   * @access public
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  function saveAllNotes() {
    angular.forEach($scope.rumination.responses, function(response) {
      if (response.needsSaving === true) {
        /**
         * Save the question
         */
        response.save($scope.consumer.apiKey, $scope.rumination.id);
        response.needsSaving = false;
      }
    });
  }

}]);
