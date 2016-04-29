'use strict';

var appModels = angular.module('app.models');

appModels.service('ConsumerService', ['$q', '$log', '$http', 'ENV', 'Consumer', 'settingsService', 'onDeviceService', function($q, $log, $http, ENV, Consumer, settingsService, onDeviceService) {

  /**
   * Gets the current Consumer if they are registered, or registers them and returns the new Consumer.
   *
   * @return {Consumer}      The Consumer object for the given consumer
   * @access public
   */
  this.getCurrent = function() {
    var deferred = $q.defer();
    settingsService.get('consumer', null).then(function(consumerData) {
      if (consumerData !== null) {
        var parsedData = JSON.parse(consumerData);
        deferred.resolve(new Consumer(parsedData));
      } else {
        getConsumerData().then(function(data) {
          createConsumer(data).then(function(consumer) {
            deferred.resolve(consumer);
          });
        });
      }
    });
    return deferred.promise;
  };

  /**
   * Create a new consumer
   *
   * @param  {Object}   data JSON Object with the new data
   * @return {Consumer}      The new Consumer object
   * @access private
   */
  function createConsumer(data) {
    var deferred = $q.defer();
    if ((!data.hasOwnProperty('device')) || (!data.device.hasOwnProperty('uuid')) || (data.device.uuid === '')) {
      $log.error('You must provide a valid device uuid.');
      deferred.reject(null);
    } else if ((!data.hasOwnProperty('push')) || (!data.push.hasOwnProperty('token')) || (data.push.token === '')) {
      $log.error('You must provide a valid push token.');
      deferred.reject(null);
    } else {
      $http({
        method: 'POST',
        url: ENV.ruminateApiUrl + '/consumers',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id':  ENV.ruminateApiClientId
        },
        data: data
      })
      .success(function(response, status, headers) {
        var apiKey = headers('x-api-key');
        if (response && apiKey) {
          response.apiKey = apiKey;
          var consumer = new Consumer(response);
          consumer.save();
          deferred.resolve(consumer);
        } else {
          deferred.reject(null);
        }
      })
      .error(function(response) {
        if (response !== null) {
          $log.error('API Error - ' + response.error);
        } else {
          $log.error('API Error - No error message sent.');
        }
        deferred.reject(null);
      });
    }
    return deferred.promise;
  }

  /**
   * Get data from the Consumers device and set defaults
   *
   * @return {Object} A JSON object containing the default information
   * @access public
   *
   *
   */
  function getConsumerData() {
    var deferred = $q.defer();
    var data = {
      device: {
        model: 'browser',
        platform: 'development',
        version: 'development',
        uuid: '9530f9e7-4391-40c7-8073-df500443831e'
      },
      push: {
        interval: 20000,
        token: 'pending',
        receive: false,
        timezone: 'America/Los_Angeles'
      }
    };
    if(onDeviceService.check()) {
      var device = $cordovaDevice.getDevice();
      data.device.model = device.model;
      data.device.platform = device.platform;
      data.device.version = device.version;
      data.device.uuid = device.uuid;
    }
    deferred.resolve(data);
    return deferred.promise;
  }

}])
.factory('Consumer', ['settingsService', function(settingsService) {

  var Consumer = function(data) {

    /**
     * Convert to a string.
     *
     * @return {String} Returns a string version of this object
     * @access public
     */
    this.toString = function() {
      return JSON.stringify(this);
    };

    /**
     * Save the Consumer
     *
     * @return {Void}
     * @access public
     */
    this.save = function() {
      settingsService.set('consumer', this.toString());
    };

    /**
     * Set the defaults for the Consumer object
     */
    angular.extend(this, {
      'device': {
        'model':    '',
        'platform': '',
        'version':  '',
        'uuid':     ''
      },
      'push': {
        'interval': 20000,
        'token':    '',
        'receive':  false,
        'timezone': ''
      }
    });

    angular.extend(this, data);
  };

  return Consumer;
}]);
