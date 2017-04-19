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
   * Have we set up the controller?
   *
   * @type {Boolean}
   */
  $scope.settingUp = false;
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
   * Did we receive this request from a notification.
   *
   * @type {Boolean}
   */
  $scope.receivedNotification = false;

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
      if (!$scope.settingUp) {
        $scope.settingUp = true;
        setup();
      }
    });

    $scope.$on('$cordovaNetwork:offline', function() {
      $scope.apiAccessible = false;
      teardown();
    });

    $scope.$on('$ionicView.enter', function() {
      if (!$scope.settingUp) {
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

    if (!$scope.settingUp) {
      setup();
    }

  });

  /**
   * Handle cordova's onResume callback
   *
   * @return {Void}
   */
  function onResume() {
    if (!$scope.settingUp) {
      setup();
    }
    document.removeEventListener('resume', onResume);
  }
  /**
   * Handle cordova's onPause callback
   *
   * @return {Void}
   */
  function onPause() {
    teardown();
    document.addEventListener('resume', onResume, false);
  }

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
    console.log('receivedNotification', $stateParams.receivedNotification);
    $scope.receivedNotification = $stateParams.receivedNotification;
    document.addEventListener('pause', onPause, false);
    $scope.id = $stateParams.ruminationId;
    $scope.settingUp = true;
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
          BibleAccessor.getVerses(rumination.passage.first.abbreviation, rumination.passage.first.chapter).then(function(verses) {
            $scope.passage = verses.slice($scope.rumination.passage.first.verse - 1, $scope.rumination.passage.last.verse);
            if ($scope.receivedNotification) {
              /**
               * Open the latest response.
               */
              $scope.receivedNotification = false;
              $scope.openResponse($scope.rumination.responses[0]);
            }
            checkPushStatus();
          });
        } else {
          checkPushStatus();
        }
      }, function() {
        $scope.rumination = null;
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
    document.removeEventListener('pause', onPause);
    $scope.settingUp = false;
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
