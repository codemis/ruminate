'use strict';

var appModels = angular.module('app.models');

appModels.service('RuminationService', ['$q', '$log', '$http', 'ENV', 'Rumination', 'Response', function($q, $log, $http, ENV, Rumination, Response) {
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
    .success(function(data) {
      if (data) {
        var ruminations = [];
        for (var i = 0; i < data.length; i++) {
          var rumination = new Rumination(data[i]);
          var responses = rumination.responses;
          rumination.responses = [];
          for (var n = 0; n < responses.length; n++) {
            rumination.responses.push(new Response(responses[n]));
          }
          ruminations.push(rumination);
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
    .success(function(data) {
      if (data) {
        var rumination = new Rumination(data);
        var responses = rumination.responses;
        rumination.responses = [];
        for (var i = 0; i < responses.length; i++) {
          rumination.responses.push(new Response(responses[i]));
        }
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
    .success(function(response) {
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
.factory('Rumination', ['$q', '$http', '$log', 'ENV', function($q, $http, $log, ENV) {

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
     * Get a title for the Rumination
     *
     * @return {String} The title
     * @access public
     */
    this.getTitle = function() {
      var title = '';
      title += this.passage.first.book;
      title += ' ' + this.passage.first.chapter;
      title += ' v. ' + this.passage.first.verse;
      if (this.passage.first.chapter !== this.passage.last.chapter) {
        title += ' - ' + this.passage.last.chapter;
        title += ' v. ' + this.passage.last.verse;
      } else {
        if (this.passage.first.verse !== this.passage.last.verse) {
          title += ' - v. ' + this.passage.last.verse;
        }
      }
      return title;
      };
    /**
     * Save the current Rumination data
     *
     * @param  {String} apiKey The Consumer's API Key
     * @return {Boolean}       Did it save?
     * @access public
     */
    this.save = function(apiKey) {
      var deferred = $q.defer();
      $http({
        method: 'PUT',
        url: ENV.ruminateApiUrl + '/consumers/ruminations/' + this.id,
        headers: {
          'Content-Type': 'application/json',
          'x-api-key':  apiKey
        },
        data: this.toAPI()
      })
      .success(function() {
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
      return deferred.promise;
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
