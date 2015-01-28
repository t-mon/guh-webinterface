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
      Device.findAll().then(function(configuredDevices) {
        $log.log(configuredDevices);
        vm.configured = configuredDevices;
      }, function(error) {
        $log.error(error);
      });
    }

    _init();

  }

}());