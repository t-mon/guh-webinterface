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
    .controller('DevicesAddController', DevicesAddController);

  DevicesAddController.$inject = ['$log', '$state', 'Vendor', 'Device'];

  function DevicesAddController($log, $state, Vendor, Device) {

    // Public Variables
    var vm = this;
    vm.supportedVendors = [];
    vm.supportedDeviceClasses = [];
    vm.currentDeviceClass = {};
    vm.discoveredDevices = [];

    // Public Methods
    vm.selectVendor = selectVendor;
    vm.selectDeviceClass = selectDeviceClass;
    vm.discoverDevices = discoverDevices;
    vm.save = save;

  
    /*
     * Private method: _init()
     */
    function _init() {
      _loadVendors();
    }

    /*
     * Private method: _loadVendors()
     */
    function _loadVendors() {
      Vendor
        .findAll()
        .then(function(vendors) {
          vm.supportedVendors = vendors;
        });
    }

    /*
     * Private method: _loadVendorDeviceClasses(vendor)
     */
    function _loadVendorDeviceClasses(vendor) {
      Vendor
        .findDeviceClasses(vendor)
        .then(function(deviceClasses) {
          vm.supportedDeviceClasses = deviceClasses;
        });
    }

    /*
     * Public method: discoverDevices()
     */
    function discoverDevices() {
      Device
        .discover(vm.currentDeviceClass)
        .then(function(discoveredDevices) {
          vm.discoveredDevices = discoveredDevices;
        });
    }

    /*
     * Public method: selectVendor()
     */
    function selectVendor(vendor) {
      _loadVendorDeviceClasses(vendor);
    }

    /*
     * Public method: selectDeviceClass()
     */
    function selectDeviceClass(deviceClass) {
      vm.currentDeviceClass = deviceClass;
      vm.createMethod = deviceClass.getCreateMethod();
      vm.setupMethod = deviceClass.getSetupMethod();
    }

    /*
     * Public method: save()
     */
    function save(device) {
      if(angular.isObject(device)) {
        vm.currentDeviceClass.descriptorId = device.id;
        Device.add(vm.currentDeviceClass);
      } else {
        Device.add(vm.currentDeviceClass);
      }

      $state.go('guh.devices.master');
    }

    _init();

  }
}());