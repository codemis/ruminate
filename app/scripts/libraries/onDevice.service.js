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
