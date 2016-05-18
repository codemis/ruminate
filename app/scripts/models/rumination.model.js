'use strict';

var appModels = angular.module('app.models');

appModels.service('RuminationService', ['$q', '$log', '$http', 'ENV', 'Rumination', function($q, $log, $http, ENV, Rumination) {
  /**
   * Get all the Ruminations for the current Consumer
   *
   * @param  {String} apiKey          The Consumer's API Key
   * @param  {String} sortRuminations A pipe seperated string (column|direction) representing how to sort the ruminations (default: createdAt|asc)
   * @param  {String} sortResponses   A pipe seperated string (column|direction) representing how to sort the responses (default: createdAt|asc)
   * @return {Array}                  An array of the Consumer's responses
   * @access public
   */
  this.all = function(apiKey, sortRuminations, sortResponses) {
    sortRuminations = sortRuminations || 'createdAt|asc';
    sortResponses = sortResponses || 'createdAt|asc';
    var deferred = $q.defer();
    var url = ENV.ruminateApiUrl + '/consumers/ruminations?sort_ruminations=' + sortRuminations + '&sort_responses=' + sortResponses;
    $http({
      method: 'GET',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key':  apiKey
      }
    })
    .success(function(response, status, headers) {
      if (response) {
        var ruminations = [];
        for (var i = 0; i < response.length; i++) {
          ruminations.push(new Rumination(response[i]));
        }
        deferred.resolve(ruminations);
      } else {
        deferred.resolve(null);
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
    return deferred.promise;
  };
  /**
   * Find a Rumination by it's id
   *
   * @param  {String}           apiKey        The Consumer's API Key
   * @param  {Number}           id            The Rumination id to find
   * @param  {String}           sortResponses A pipe seperated string (column|direction) representing how to sort the responses (default: createdAt|asc)
   * @return {Rumination|null}                The Rumination your looking for
   * @access public
   */
  this.findById = function(apiKey, id, sortResponses) {
    sortResponses = sortResponses || 'createdAt|asc';
    var deferred = $q.defer();
    var url = ENV.ruminateApiUrl + '/consumers/ruminations/' + id + '?sort_responses=' + sortResponses;
    $http({
      method: 'GET',
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key':  apiKey
      }
    })
    .success(function(response, status, headers) {
      if (response) {
        deferred.resolve(new Rumination(response));
      } else {
        deferred.resolve(null);
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
    return deferred.promise;
  };
  /**
   * Create a new Rumination
   *
   * @param  {String}           apiKey The Consumer's API Key
   * @param  {Object}           data   The Rumination data
   * @return {Rumination|null}          The Rumination object
   * @access public
   */
  this.new = function(apiKey, data) {
    var deferred = $q.defer();
    $http({
      method: 'POST',
      url: ENV.ruminateApiUrl + '/consumers/ruminations',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key':  apiKey
      },
      data: data
    })
    .success(function(response, status, headers) {
      if (response) {
        var rumination = new Rumination(response);
        deferred.resolve(rumination);
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
    return deferred.promise;
  };
  /**
   * Get the rumination for the today.
   *
   * @param  {String}           apiKey  The Consumer's API Key
   * @return {Rumination|null}          The Rumination for today
   * @access public
   */
  this.today = function(apiKey) {
    var today = new Date();
    var deferred = $q.defer();
    this.all(apiKey, 'createdAt|Desc').then(function(ruminations) {
      if (ruminations) {
        var rumination = null;
        for (var i = 0; i < ruminations.length; i++) {
          var createdAt = new Date(ruminations[i].createdAt);
          if ((!rumination) && (createdAt.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0))) {
            rumination = ruminations[i];
          }
        }
        deferred.resolve(rumination);
      } else {
        deferred.reject(null);
      }
    }, function() {
      deferred.reject(null);
    });
    return deferred.promise;
  };
}])
.factory('Rumination', ['$q', '$http', 'ENV', function($q, $http, ENV) {

  var Rumination = function(data) {

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
     * Prepare the Rumination to be sent to the API using it's current data
     *
     * @return {Object} The data for the API
     * @access public
     */
    this.toAPI = function() {
      return {
        passage: {
          version:  this.passage.version,
          snippet:  this.passage.snippet,
          first:    {
            book:         this.passage.first.book,
            abbreviation: this.passage.first.abbreviation,
            chapter:      this.passage.first.chapter,
            verse:        this.passage.first.verse
          },
          last:     {
            book:         this.passage.last.book,
            abbreviation: this.passage.last.abbreviation,
            chapter:      this.passage.last.chapter,
            verse:        this.passage.last.verse
          }
        }
      };
    };

    /**
     * Set the defaults for the Consumer object
     */
    angular.extend(this, {
      'passage': {
        'version':  '',
        'snippet':  '',
        'first':    {
          'book':         '',
          'abbreviation': '',
          'chapter':      1,
          'verse':        1
        },
        'last':     {
          'book':         '',
          'abbreviation': '',
          'chapter':      1,
          'verse':        1
        }
      }
    });

    angular.extend(this, data);
  };

  return Rumination;
}]);
