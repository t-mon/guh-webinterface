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

  DevicesMasterController.$inject = ['$log', 'Vendor', 'Device'];

  function DevicesMasterController($log, Vendor, Device) {
    /*
     * Public variables
     */
    var vm = this;
    vm.configured = [];

    /*
     * Private methods
     */
    function _init() {
      // var configuredDevice = {};

      Device
        .findAll()
        .then(function(devices) {
          angular.forEach(devices, function(device) {
            var configuredDevice = device;

            // Get deviceClass for each device
            Device
              .findDeviceClass(device)
              .then(function(deviceClass) {
                configuredDevice.deviceClass = deviceClass;
 
                // Get vendor for each deviceClass (device)
                Vendor
                  .find(configuredDevice.deviceClass.vendorId)
                  .then(function(vendor) {
                    configuredDevice.vendor = vendor;
                    configuredDevice.svgClass = vendor
                      .name
                      .toLowerCase()
                      .replace(/\s/g, '-')
                      .replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '');

                    vm.configured.push(configuredDevice);
                    $log.log(configuredDevice.svgClass);
                  });
              });
          });
        });
    }

    _init();

  }

}());