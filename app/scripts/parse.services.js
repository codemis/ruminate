'use strict';
/*global Parse */
angular.module('parse.services', [])

/**
 * A service for initializing parse
 *
 * @author Johnathan Pulos <johnathan@missionaldigerati.org>
 */
.factory('ParseService', ['ParseUser', function(ParseUser) {
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
  parseServiceObject.initialize = function(appId, clientId, javascriptKey) {
    Parse.initialize(appId, javascriptKey);
    parsePlugin.initialize(appId, clientId, function() {
      parsePlugin.subscribe('allDevices', function() {
        ParseUser.createAndLogin();
      },
      function() {
        console.log('Unable to subscribe to allDevices');
      });
    },
    function() {
      console.log('Unable to initialize the parsePlugin');
    });
  };

  return parseServiceObject;
}])
/**
 * A Service for handling ParseUser's model
 *
 * @author Johnathan Pulos <johnathan@missionaldigerati.org>
 */
.factory('ParseUser', ['$localStorage', function($localStorage) {
  /**
   * The parseUser Object that will be returned
   *
   * @type {Object}
   */
  var parseUserObject = {};

  /**
   * Create a GUID for the username
   *
   * @return {String} The username
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  function createUsername() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0;
      var v = (c === 'x') ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }
  /**
   * Create a Random password to the set length
   *
   * @param  {Integer} length The length of the password
   *
   * @return {String}         The new password
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  function createPassword(length) {
    var charset = 'abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var password = '';
    for (var i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    return password;
  }
  /**
   * Create the user if it does not exist, and log them in
   *
   * @return {Promise} A promise to login or sign up
   *
   * @author Johnathan Pulos <johnathan@missionaldigerati.org>
   */
  parseUserObject.createAndLogin = function() {
    var userData = $localStorage.getObject('parse_user');
    if (Object.keys(userData).length === 0) {
      var user = new Parse.User();
      var username = createUsername().toString();
      var password = createPassword(12).toString();
      /**
       * create and login
       */
      user.set('username', username);
      user.set('password', password);

      return user.signUp(null, {
        success: function() {
          $localStorage.setObject('parse_user', {username: username, password: password});
          parsePlugin.subscribe('user-'+username, function(){}, function(){});
        },
        error: function(user, error) {
          console.log('Unable to sign up:  ' + error.code + ' ' + error.message);
        }
      });
    } else {
      console.log('I am a user.');
      return Parse.User.logIn(userData.username, userData.password, {
        success: function() {
        },
        error: function(user, error) {
          console.log('Unable to login:  ' + error.code + ' ' + error.message);
        }
      });
    }
  };

  return parseUserObject;
}]);