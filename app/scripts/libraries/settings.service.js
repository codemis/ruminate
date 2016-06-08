/**
 * This file is part of Year of Prayer App.
 *
 * Year of Prayer App is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Year of Prayer API is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 *
 * @license http://opensource.org/licenses/gpl-license.php GNU Public License
 *
 */
'use strict';

var appLibraries = angular.module('app.libraries');

appLibraries.service('settingsService', ['$window', '$log', '$q', '$ionicPlatform', '$cordovaFile', 'onDeviceService', function($window, $log, $q, $ionicPlatform, $cordovaFile, onDeviceService) {
  /**
   * The settings for the app
   *
   * @type {Object}
   */
  var settings = {};
  /**
   * Filename for the local settings file
   *
   * @type {String}
   */
  var settingsFile = 'app_settings.txt';
  /**
   * Has the content been retrieved?
   *
   * @type {Boolean}
   */
  var retrieved = false;
  /**
   * Set a setting for the app
   *
   * @param  {String} key   The key to use
   * @param  {String} value The value for the setting
   *
   *
   */
  this.set = function(key, value) {
    settings[key] = value;
    save();
  };
  /**
   * Retrieve a setting by key
   *
   * @param  {String} key          The key to retrieve
   * @param  {String} defaultValue A default value to return if the setting does not exist
   *
   * @return {Mixed}               The setting value (Uses a promise)
   *
   *
   */
  this.get = function(key, defaultValue) {
    return retrieve().then(function() {
      return (key in settings) ? settings[key] : defaultValue;
    });
  };
  /**
   * PRIVATE
   */
  /**
   * Save the settings in the appropriate place (localStorage if in browser, in file if installed)
   *
   * @return {Void}
   *
   *
   */
  function save() {
    var appSettings = JSON.stringify(settings);
    if (onDeviceService.check()) {
      $ionicPlatform.ready(function() {
        $log.log('Using a file for storage.');
        $cordovaFile.writeFile(cordova.file.dataDirectory, settingsFile, appSettings, true);
      });
    } else {
      $window.localStorage.appSettings = appSettings;
      $log.log('Using local storage.');
    }
  }
  /**
   * Get the settings from the appropriate storage
   *
   * @return {Object} The settings object (Passes promise initially)
   *
   *
   */
  function retrieve() {
    var deferred = $q.defer();
    if(retrieved) {
      $log.log('Using the current cache data.');
      deferred.resolve(settings);
    }else if(onDeviceService.check()) {
      $log.log('Using a file for storage.');
      $cordovaFile.readAsText(cordova.file.dataDirectory, settingsFile).then(
      function(data) {
        if (data !== '') {
          settings = JSON.parse(data);
          retrieved = true;
        } else {
          settings = {};
        }
        deferred.resolve(settings);
      },
      function() {
        /**
         * The file does not exist yet, so respond with an empty object
         */
        settings = {};
        deferred.resolve({});
      });
    } else {
      var appSettings = $window.localStorage.appSettings;
      if (typeof appSettings === 'undefined') {
        settings = {};
      } else {
        settings = JSON.parse(appSettings);
      }
      retrieved = true;
      $log.log('Using local storage.');
      deferred.resolve(settings);
    }
    return deferred.promise;
  }
}]);
