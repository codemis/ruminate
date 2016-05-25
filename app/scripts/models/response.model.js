'use strict';

var appModels = angular.module('app.models');

appModels.service('ResponseService', function() {
})
.factory('Response', ['$q', '$http', '$log', 'ENV', function($q, $http, $log, ENV) {

  var Response = function(data) {

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
        answer: this.answer
      };
    };
    /**
     * Save the current Response data
     *
     * @param  {String} apiKey The Consumer's API Key
     * @return {Boolean}       Did it save?
     * @access public
     */
    this.save = function(apiKey, ruminationId) {
      var deferred = $q.defer();
      if ((!apiKey) || (!ruminationId)) {
        $log.log('Unable to save the Response.  You are missing the API key or the rumination id.');
        deferred.reject(false);
      } else {
        $http({
          method: 'PUT',
          url: ENV.ruminateApiUrl + '/consumers/ruminations/' + ruminationId + '/responses/' + this.id,
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
      }
      return deferred.promise;
    };
    /**
     * Set the defaults for the Consumer object
     */
    angular.extend(this, {
      'answer': '',
      'needsSaving': false
    });

    angular.extend(this, data);
  };

  return Response;
}]);
