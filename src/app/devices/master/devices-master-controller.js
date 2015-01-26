/* Copyright (C) 2015 guh
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 *
 */

(function(){
  "use strict";

  angular
    .module('guh.devices')
    .controller('DevicesMasterController', DevicesMasterController);

  DevicesMasterController.$inject = ['$log', 'Device'];

  function DevicesMasterController($log, Device) {
    /*
     * Public variables
     */
    var vm = this;
    vm.configured = [];

    /*
     * Private methods
     */
    function _init() {
      Device.findAll().then(success, failure);

      function success(configuredDevices) {
        vm.configured = configuredDevices;
      }

      function failure(error) {
        $log.error(error);
      }
    }

    _init();

  }

}());