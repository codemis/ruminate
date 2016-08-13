'use strict';

var appControllers = angular.module('app.controllers');

appControllers.controller('SettingsController', ['$ionicPlatform', '$scope', '$q', 'onDeviceService', 'PushNotify', 'ConsumerService', 'TimezoneService', function($ionicPlatform, $scope, $q, onDeviceService, PushNotify, ConsumerService, TimezoneService) {
  /**
   * The push notify service object
   * @param {Object}
   * @access private
   */
  var pushNotify;
  /**
   * Is the API accessible
   *
   * @type {Boolean}
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
   * An array of timezone objects
   *selectedInterval
   * @type {Array}
   */
  $scope.timeZones = [];
  /**
   * The selected Time Zone
   *
   * @type {Object}
   */
  $scope.selectedTimezone = {};
  /**
   * An array of time objects
   *
   * @type {Array}
   */
  $scope.times = [];
  /**
   * The selected time for push
   *
   * @type {Object}
   */
  $scope.selectedInterval = {};
  /**
   * A string giving instruction to change push notification Settings
   *
   * @type {String}
   */
  $scope.pushInstruction = '';
  /**
   * The available intervals
   *
   * @type {Array}
   */
  $scope.availableIntervals = [
    {
      val:    3600,
      label:  'Every Hour'
    },
    {
      val:    7200,
      label:  'Every 2 Hours'
    },
    {
      val:    10800,
      label:  'Every 3 Hours'
    },
    {
      val:    14400,
      label:  'Every 4 Hours'
    },
    {
      val:    18000,
      label:  'Every 5 Hours'
    },
    {
      val:    21600,
      label:  'Every 6 Hours'
    }
  ];

  $ionicPlatform.ready(function() {
    /**
     * Handle online/offline access
     */
    if(onDeviceService.check()) {
      $scope.apiAccessible = $cordovaNetwork.isOnline();
    }
    /**
     * Watch for events that are broadcasted
     *
     *
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
    $scope.$on('PushNotify:pollPushStatusCompleted', function(event, data) {
      if ($scope.isRegistered()) {
        $scope.consumer.push.receive = data.receivePush;
        $scope.consumer.save(true);
      }
      setPushOptionValues();
    });

  });
  /**
   * Check if the Consumer is registered
   *
   * @return {Boolean} Is the Consumer registered?
   * @access private
   *
   *
   */
  $scope.isRegistered = function() {
    return (($scope.consumer !== null) && ($scope.consumer.apiKey !== ''));
  };
  /**
   * Do they receive push notification?
   *
   * @return {Boolean} Yes or No?
   * @access public
   *
   *
   */
  $scope.receivingPush = function() {
    if ($scope.isRegistered()) {
      return ($scope.consumer.push.receive === true) ? true : false;
    } else {
      return false;
    }
  };
  /**
   * Automatically detect the TimeZone
   *
   * @return {Void}
   * @access public
   *
   *
   */
  $scope.detectTimezone = function() {
    $scope.changeTimezone(TimezoneService.current());
  };
  /**
   * Change the push interval time for the push notification
   *
   * @param  {Object} i The selected interval
   * @return {Void}
   * @access public
   *
   *
   */
  $scope.changeInterval = function(i) {
    if ($scope.isRegistered) {
      $scope.consumer.push.interval = i.val;
      $scope.consumer.save(true);
    }
  };

  /**
   * Change the time_zone for the push notification
   *
   * @param  {Object} selectedTimezone The selected time zone
   * @return {Void}
   * @access public
   *
   *
   */
  $scope.changeTimezone = function(selectedTimezone) {
    if ($scope.isRegistered) {
      var selected = TimezoneService.find(selectedTimezone.val);
      $scope.consumer.push.timezone = selected;
      setSelectedTimezone(selected);
      $scope.consumer.save(true);
    }
  };

  /**
   * Run a check on the device for the current push settings.
   *
   * @return {Void}
   * @access public
   *
   *
   */
  $scope.checkPushSettings = function() {
    pushNotify.checkPushStatus().then(function(receivePush) {
      if ((receivePush !== null) && ($scope.consumer.push.receive !== receivePush)) {
        $scope.consumer.push.receive = receivePush;
        $scope.consumer.save(true);
        setPushOptionValues();
      }
    });
  };

  /**
   * PRIVATE METHODS
   */
  /**
   * Setup the controller
   *
   * @return {Void}
   *
   *
   */
  function setup() {
    setPushInstructions();
    pushNotify = new PushNotify();

    if ($scope.apiAccessible) {
      $scope.consumer = null;
      ConsumerService.getCurrent().then(function(consumer) {
        $scope.consumer = consumer;
        setPushOptionValues();
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
        } else {
          $scope.checkPushSettings();
        }
      });
    }
  }
  /**
   * Teardown the controller.
   *
   * @return {Void}
   *
   *
   */
  function teardown() {
  }
  /**
   * Set the value of the selected Time Zone
   *
   * @param  {TimeZone} selectedTimezone The selected TimeZone Object
   * @access public
   */
  function setSelectedTimezone(timeZoneToSelect) {
    var selected = null;
    angular.forEach($scope.timeZones, function(timeZone, index) {
      if (timeZone.val === timeZoneToSelect.val) {
        selected = index;
      }
    });
    $scope.selectedTimezone = $scope.timeZones[selected];
  }
  /**
   * Set the push instructions based on the device
   *
   * @access private
   *
   *
   */
  function setPushInstructions() {
    /*globals ionic */
    if (ionic.Platform.isAndroid()) {
      $scope.pushInstruction = 'To change whether you receive daily reminders, visit the device Settings.  Tap on Apps or Notifications.  Now tap Ruminate, and change your settings.    Finally, open the Ruminate app, and tap the "Check Device Settings" below.';
    } else {
      $scope.pushInstruction = 'To change whether you receive daily reminders, visit the Settings App.  Tap on Notifications.  Now tap Ruminate, and change your settings.  Finally, open the Ruminate app, and tap the "Check Device Settings" below.';
    }
  }
  /**
   * Set the default values for the push notification options
   *
   * @access private
   *
   *
   */
  function setPushOptionValues() {
    setupTimezones($scope.consumer.push.timezone);
    setupIntervals($scope.consumer.push.interval);
  }
  /**
   * Setup the TimeZone selector
   *
   * @param {String}  current  The current selected time zone
   * @return {Promise}
   * @access private
   *
   *
   */
  function setupTimezones(current) {
    $scope.timeZones = TimezoneService.all();
    if (current !== null) {
      setSelectedTimezone(current);
    }
  }
  /**
   * Setup the interval selector
   *
   * @param  {String} current The current interval to push
   * @return {Void}
   * @access private
   */
  function setupIntervals(current) {
    var selected = $scope.availableIntervals.filter(function(obj) {
      return obj.val === current;
    });
    $scope.selectedInterval = selected[0];
  }
  /**
   * Pad the given number with a leading 0
   *
   * @param  {Integer} number The number to pad
   *
   * @return {String}  The padded number
   *
   *
   */
  function pad(number) {
    return number<10 ? '0'+number : number;
  }
}]);
