'use strict';

var appControllers = angular.module('app.controllers');

/*jshint camelcase: false */
appControllers.controller('HomeController', ['$scope', '$log', '$ionicPlatform', '$location', '$interval', '$cordovaNetwork', 'onDeviceService', 'ConsumerService', 'RuminationService', 'BibleAccessor', 'PushNotify', function($scope, $log, $ionicPlatform, $location, $interval, $cordovaNetwork, onDeviceService, ConsumerService, RuminationService, BibleAccessor, PushNotify) {

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
   * Saving Interval for checking whether we need to push a save
   * @type {Object|Null}
   * @access private
   */
  var savingInterval = null;
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

    if (!settingUp) {
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
    settingUp = true;

    ConsumerService.getCurrent().then(function(consumer) {
      $scope.consumer = consumer;
      RuminationService.today(consumer.apiKey).then(function(rumination) {
        $scope.rumination = rumination;
        if (rumination) {
          BibleAccessor.getVerses(BibleAccessor.bookDamMap[rumination.passage.first.abbreviation], rumination.passage.first.abbreviation, rumination.passage.first.chapter, function(verses) {
            $scope.passage = verses.slice($scope.rumination.passage.first.verse - 1, $scope.rumination.passage.last.verse);
            checkPushStatus();
          });
        } else {
          checkPushStatus();
        }
      }, function() {
        $scope.rumination = null;
        checkPushStatus();
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
    settingUp = false;
    $interval.cancel(savingInterval);
    savingInterval = null;
    saveAllNotes();
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

  /**
   * Save all notes by sending it to Parse
   *
   * @return {Void}
   * @access public
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  function saveAllNotes() {
    if (($scope.rumination) && ($scope.rumination.responses)) {
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
  }

}]);
