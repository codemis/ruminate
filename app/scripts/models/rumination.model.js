'use strict';

var appModels = angular.module('app.models');

appModels.service('RuminationService', ['$q', '$log', '$http', 'ENV', 'Rumination', function($q, $log, $http, ENV, Rumination) {
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
