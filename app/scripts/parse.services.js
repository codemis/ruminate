'use strict';

angular.module('parse.services', [])

/**
 * A service for initializing parse
 *
 * @author Johnathan Pulos <johnathan@missionaldigerati.org>
 */
.factory('ParseService', function() {
  /**
   * The object for the parse service
   *
   * @type {Object}
   */
  var parseServiceObject = {};

  /**
   * Initialize Parse
   *
   * @param  {String} appId         The Parse Application Id
   * @param  {String} javascriptKey The Parse Javascript Key
   *
   * @return {Void}
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  parseServiceObject.initialize = function(appId, javascriptKey) {
    console.log('INITIALIZE: ' + appId + ' - ' +javascriptKey);
    Parse.initialize(appId, javascriptKey);
  };

  return parseServiceObject;
})
/**
 * A Service for handling ParseUser's model
 *
 * @author Johnathan Pulos <johnathan@missionaldigerati.org>
 */
.factory('ParseUser', function() {
  /**
   * The parseUser Object that will be returned
   *
   * @type {Object}
   */
  var parseUserObject = {};

  return parseUserObject;
});