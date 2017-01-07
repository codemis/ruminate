'use strict';

var appLibraries = angular.module('app.libraries');

/**
 * A Utility Service for determining if cordova is available, therefore we are on the device.
 */
appLibraries.service('onDeviceService', function() {
  /**
   * Check if we are on device?
   *
   * @return {Boolean} Are we on the device?
   * @access public
   *
   *
   */
  this.check = function() {
    return (typeof cordova !== 'undefined');
  };
});
