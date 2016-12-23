'use strict';

var appControllers = angular.module('app.controllers');

/*jshint camelcase: false */
appControllers.controller('RuminationController', ['$scope', '$log', '$ionicPlatform', '$ionicModal', '$location', '$interval', '$cordovaNetwork', '$stateParams', '$filter', 'onDeviceService', 'ConsumerService', 'RuminationService', 'BibleAccessor', 'PushNotify', function($scope, $log, $ionicPlatform, $ionicModal, $location, $interval, $cordovaNetwork, $stateParams, $filter, onDeviceService, ConsumerService, RuminationService, BibleAccessor, PushNotify) {

  /**
   * The title for the view
   *
   * @type {String}
   * @access public
   */
  $scope.viewTitle = 'Ruminate';
  /**
   * An id for a specific Rumination.
   *
   * @type {Integer}
   * @access public
   */
  $scope.id = null;
  /**
   * Is the API accessible
   *
   * @type {Boolean}
   * @access public
   */
  $scope.apiAccessible = true;
  /**
   * Are we setting up the controller?
   *
   * @type {Boolean}
   */
  $scope.isSettingUp = false;
  /**
   * Should we trigger a focus on the answer input.
   *
   * @type {Boolean}
   * @access public
   */
  $scope.focusOnAnswer = false;
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
  $scope.rumination = '';
  /**
   * The passage that was selected
   *
   * @type {String}
   */
  $scope.passage = '';
  /**
   * Is the passage showing?
   *
   * @type {Boolean}
   */
  $scope.passageShowing = false;
  /**
   * The Response modal for answering a question
   *
   * @type {Object}
   */
  $scope.responseModal = null;
  /**
   * The current response you are working on.
   *
   * @type {Response}
   */
  $scope.currentResponse = null;
  /**
   * Keep track if the tool is setting up
   *
   * @type {Boolean}
   */
  var settingUp = false;


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
      if (!$scope.isSettingUp) {
        $scope.isSettingUp = true;
        setup();
      }
    });

    $scope.$on('$cordovaNetwork:offline', function() {
      $scope.apiAccessible = false;
      teardown();
    });

    $scope.$on('$ionicView.enter', function() {
      if (!$scope.isSettingUp) {
        $scope.isSettingUp = true;
        setup();
      }
    });

    $scope.$on('PushNotify:pollPushStatusCompleted', function(event, data) {
      if ($scope.isRegistered()) {
        updatePushStatus(data.receivePush);
      }
    });

    $scope.$on('$ionicView.leave', function() {
      teardown();
    });

    $scope.$on('$destroy', function() {
      teardown();
    });

    if (!$scope.isSettingUp) {
      $scope.isSettingUp = true;
      setup();
    }

  });

  /**
   * Check if the Consumer is registered
   *
   * @return {Boolean} Is the Consumer registered?
   * @access private
   *
   */
  $scope.isRegistered = function() {
    return (($scope.consumer !== null) && ($scope.consumer.apiKey !== ''));
  };

  /**
   * Toggle the passage
   *
   * @return {Void}
   * @access public
   */
  $scope.togglePassage = function() {
    $scope.passageShowing = !$scope.passageShowing;
  };
  /**
   * Select a passage for Rumination
   *
   * @return {Void}
   * @access public
   */
  $scope.selectPassage = function() {
    $location.path('/app/home/chapter-select');
  };

  /**
   * Open the response for edinging.
   *
   * @param  {Response} response The Response object
   * @return {Void}
   */
  $scope.openResponse = function(response) {
    $scope.currentResponse = response;
    $scope.responseModal.show().then(function() {
      $scope.focusOnAnswer = true;
    });
  };
  /**
   * Save the current response content.
   *
   * @return {Void}
   */
  $scope.saveResponseEdit = function() {
    $scope.currentResponse.save($scope.consumer.apiKey, $scope.rumination.id);
    $scope.currentResponse = null;
    $scope.responseModal.hide().then(function() {
      $scope.focusOnAnswer = false;
    });
  };
  /**
   * Cancel the Request to edit the response.
   *
   * @return {Void}
   */
  $scope.cancelResponseEdit = function() {
    $scope.currentResponse = null;
    $scope.responseModal.hide().then(function() {
      $scope.focusOnAnswer = false;
    });
  };

  /**
   * Setup the controller
   *
   * @access private
   */
  function setup() {
    $scope.id = $stateParams.ruminationId;
    settingUp = true;
    $ionicModal.fromTemplateUrl('templates/response-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      $scope.responseModal = modal;
    });
    ConsumerService.getCurrent().then(function(consumer) {
      $scope.consumer = consumer;
      var promise = null;
      if ($scope.id) {
        promise = RuminationService.findById(consumer.apiKey, $scope.id, 'createdAt|desc');
      } else {
        promise = RuminationService.today(consumer.apiKey);
      }
      promise.then(function(rumination) {
        if ($scope.id) {
          $scope.viewTitle = $filter('date')(rumination.createdAt, 'MMM. dd, yyyy');
        }
        $scope.rumination = rumination;
        if (rumination) {
          BibleAccessor.getVerses(BibleAccessor.bookDamMap[rumination.passage.first.abbreviation], rumination.passage.first.abbreviation, rumination.passage.first.chapter, function(verses) {
            $scope.passage = verses.slice($scope.rumination.passage.first.verse - 1, $scope.rumination.passage.last.verse);
            $scope.isSettingUp = false;
            checkPushStatus();
          });
        } else {
          $scope.isSettingUp = false;
          checkPushStatus();
        }
      }, function() {
        $scope.rumination = null;
        $scope.isSettingUp = false;
        checkPushStatus();
      });
    });
  }

  /**
   * Teardown the controller
   *
   * @access private
   */
  function teardown() {
    settingUp = false;
  }

  /**
   * Check the user's current push status
   *
   * @return {Void}
   * @access public
   */
  function checkPushStatus() {
    var pushNotify = new PushNotify();
    if (($scope.consumer.push.token === '') || ($scope.consumer.push.token === 'pending')) {
      pushNotify.request().then(function(pushToken) {
        if ((pushToken) && (pushToken !== '')) {
          /**
           * Save the new token
           */
          $scope.consumer.push.token = pushToken;
          $scope.consumer.save(true);
        }
      });
    }
  }
  /**
   * Update the consumer's push settings if it changed
   *
   * @param  {Boolean}  receivePush   Do they want push notification?
   * @access private
   */
  function updatePushStatus(receivePush) {
    if ((receivePush !== null) && ($scope.consumer.push.receive !== receivePush)) {
      $scope.consumer.push.receive = receivePush;
      $scope.consumer.save(true);
    }
  }

}]);
