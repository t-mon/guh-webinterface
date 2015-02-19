/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
 *                                                                                     *
 * Copyright (c) 2015 guh                                                              *
 *                                                                                     *
 * Permission is hereby granted, free of charge, to any person obtaining a copy        *
 * of this software and associated documentation files (the "Software"), to deal       *
 * in the Software without restriction, including without limitation the rights        *
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell           * 
 * copies of the Software, and to permit persons to whom the Software is               *
 * furnished to do so, subject to the following conditions:                            *
 *                                                                                     *
 * The above copyright notice and this permission notice shall be included in all      *
 * copies or substantial portions of the Software.                                     *
 *                                                                                     *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR          * 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,            *
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE         *
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER              *
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,       *
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE       *
 * SOFTWARE.                                                                           *
 *                                                                                     *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

(function(){
"use strict";

  angular
    .module('guh.devices')
    .controller('DevicesAddController', DevicesAddController);

  DevicesAddController.$inject = ['$log', '$state', 'Vendor', 'DeviceClass', 'Device', 'errors'];

  function DevicesAddController($log, $state, Vendor, DeviceClass, Device, errors) {

    // Public Variables
    var vm = this;
    vm.supportedVendors = [];
    vm.supportedDeviceClasses = [];
    vm.currentDeviceClass = {};
    vm.discoveredDevices = [];
    vm.wizard = {};

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
      // Device
      //   .discover(vm.currentDeviceClass)
      //   .then(function(discoveredDevices) {
      //     vm.discoveredDevices = discoveredDevices;
      //   });
      DeviceClass
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

      // Go to next wizard step
      vm.wizard.next();
    }

    /*
     * Public method: selectDeviceClass()
     */
    function selectDeviceClass(deviceClass) {
      vm.currentDeviceClass = deviceClass;
      vm.createMethod = deviceClass.getCreateMethod();
      vm.setupMethod = deviceClass.getSetupMethod();

      // Go to next wizard step
      vm.wizard.next();

      // Automatically start disocvery of devices
      if(vm.createMethod.title === 'Discovery' && vm.currentDeviceClass.discoveryParamTypes.length === 0) {
        discoverDevices();
      }
    }

    /*
     * Public method: save()
     */
    function save(device) {
      if(angular.isObject(device)) {
        vm.currentDeviceClass.descriptorId = device.id;
      }

      Device
        .add(vm.currentDeviceClass)
        .then(function() {
          $state.go('guh.devices.master');
        })
        .catch(function(error) {
          $log.log(error);
          $log.log(errors.device);
        });
    }

    _init();

  }
}());