'use strict';

var appLibraries = angular.module('app.libraries');

/**
 * This service handles the requesting for access to push notifications, checking if we have access to push, and what to do when
 * responds to a push.
 * When running request(),  it will poll the hasPermissions to get it's setting.  Once hasPermission responds, it will broadcast the following:
 * PushNotify:pollPushStatusCompleted - includes object with key receivePush set to an integer if they will receive push (0 = No, 1 = Yes).
 */
/*jshint camelcase: false */
appLibraries.factory('PushNotify', ['$rootScope', '$cordovaPushV5', '$log', '$q', '$interval', '$ionicHistory', '$location', '$state', 'onDeviceService', 'ENV', function($rootScope, $cordovaPushV5, $log, $q, $interval, $ionicHistory, $location, $state, onDeviceService, ENV) {

  var PushNotify = function() {
    /**
     * The options for push notification
     *
     * @type {Object}
     * @access private
     */
    var mobilePushOptions = {
      android: {
        senderID: ENV.androidSenderId,
        sound: 'true',
      },
      ios: {
        alert: 'false',
        badge: 'false',
        sound: 'true'
      }
    };
    /**
     * The Push object from Cordova's push service
     * @param {Object}
     * @access private
     */
    var push = null;
    /**
     * The polling object for checking push status
     * @type {Object|null}
     * @access private
     */
    var pushPollingInterval = null;
    /**
     * Initialize the factory
     *
     * @return {void}
     * @access public
     *
     */
    this.initialize = function() {
      if (onDeviceService.check()) {
        push = $cordovaPushV5.initialize(mobilePushOptions);
        $cordovaPushV5.onNotification();
        /**
         * All push notifications go to the home page.
         */
        $rootScope.$on('$cordovaPushV5:notificationReceived', function() {
          $ionicHistory.clearCache();
          $ionicHistory.nextViewOptions({
            disableBack: true,
            disableAnimate: true,
            historyRoot: true
          });
          $state.go('app.home', { receivedNotification: true }).then(function() {
            $rootScope.$broadcast('PushNotify:notificationReceived', {});
          });
        });
        $log.log('Push Notification initialized.');
      }
    };

    /**
     * Request permission to send push notifications
     * @return {String} The device's registration id (push token)
     * @access public
     *
     */
    this.request = function() {
      var deferred = $q.defer();
      var self = this;
      if (onDeviceService.check()) {
        $cordovaPushV5.register().then(
          function(registationId) {
            $log.log('We were able to register for push.  Our id is: '+registationId);
            self.pollPushStatus();
            deferred.resolve(registationId);
          },
          function() {
            $log.error('Unable to register the Push Notification.');
            deferred.reject('');
          }
        );
      } else {
        deferred.resolve('');
      }
      return deferred.promise;
    };
    /**
     * Poll the hasPermission function of the Push plugin.  When you register a new push notification,  it can take a while for
     * the method to respond.  This will poll it and wait for a response.
     *
     * @return {Promise}
     * @access public
     *
     */
    this.pollPushStatus = function() {
      var self = this;
      if ((!onDeviceService.check()) || (pushPollingInterval !== null)) {
        return;
      }
      pushPollingInterval = $interval(function() {
        $log.log('Polling hasPermissions');
        self.checkPushStatus().then(function(receivePush) {
          if (receivePush !== null) {
            $interval.cancel(pushPollingInterval);
            pushPollingInterval = null;
            $rootScope.$broadcast('PushNotify:pollPushStatusCompleted', {receivePush: receivePush});
          }
        });
      }, 3000);
    };

    /**
     * Check whether we have access for push notification
     *
     * @return {Promise}
     *
     */
    this.checkPushStatus = function() {
      var deferred = $q.defer();
      if (onDeviceService.check()) {
        /*globals PushNotification */
        PushNotification.hasPermission(
          function(data) {
            var receivePush = (data.isEnabled) ? true : false;
            deferred.resolve(receivePush);
          }, function() {
            deferred.resolve(null);
          }
        );
      } else {
        deferred.resolve(null);
      }
      return deferred.promise;
    };

    /**
     * Validate that all the push settings are correctly set.
     *
     * @param  {Object} settings The push notification settings
     * @return {Boolen}          Are they correct?
     * @access public
     */
    this.validatePushSettings = function(settings) {
      var valid = true;
      if ((settings.push.token === '') || (settings.push.token === null)) {
        valid = false;
      }
      if ((settings.push.interval === '') || (settings.push.interval === null)) {
        valid = false;
      }
      if ((settings.timezone === '') || (settings.timezone === null)) {
        valid = false;
      }
      return valid;
    };

    this.initialize();
  };

  return PushNotify;
}]);
