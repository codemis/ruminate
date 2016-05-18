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
        var data = getConsumerData();
        createConsumer(data).then(function(consumer) {
          deferred.resolve(consumer);
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
          consumer.save(false);
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
    /*globals jstz */
    var tz = jstz.determine();
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
        timezone: tz.name()
      }
    };
    if(onDeviceService.check()) {
      var device = $cordovaDevice.getDevice();
      data.device.model = device.model;
      data.device.platform = device.platform;
      data.device.version = device.version;
      data.device.uuid = device.uuid;
    }
    return data;
  }

}])
.factory('Consumer', ['$q', '$http', 'settingsService', 'ENV', function($q, $http, settingsService, ENV) {

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
     * Prepare the Consumer to be sent to the API using it's current data
     *
     * @return {Object} The data for the API
     * @access public
     */
    this.toAPI = function() {
      return {
        device: {
          model:    this.device.model,
          platform: this.device.platform,
          version:  this.device.version,
          uuid:     this.device.uuid
        },
        push: {
          interval: this.push.interval,
          token:    this.push.token,
          receive:  this.push.receive,
          timezone: this.push.timezone
        }
      };
    };

    /**
     * Save the Consumer
     *
     * @param {Boolean}   updateAPI Do you want the API to update?
     * @return {Boolean}  Did it save?
     * @access public
     */
    this.save = function(updateAPI) {
      var deferred = $q.defer();
      settingsService.set('consumer', this.toString());
      if (updateAPI) {
        $http({
          method: 'PUT',
          url: ENV.ruminateApiUrl + '/consumers',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key':  this.apiKey
          },
          data: this.toAPI()
        })
        .success(function(response, status, headers) {
          deferred.resolve(true);
        })
        .error(function(response) {
          if (response !== null) {
            $log.error('API Error - ' + response.error);
          } else {
            $log.error('API Error - No error message sent.');
          }
          deferred.reject(false);
        });
      } else {
        deferred.resolve(true);
      }
      return deferred.promise;
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
