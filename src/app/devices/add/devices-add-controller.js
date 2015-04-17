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

  DevicesAddController.$inject = ['$log', '$state', 'errors', 'DSVendor', 'DSDeviceClass', 'DSDevice'];

  function DevicesAddController($log, $state, errors, DSVendor, DSDeviceClass, DSDevice) {

    /*
     * Public Variables
     */
    var vm = this;
    vm.supportedVendors = [];
    vm.selectedVendor = {};
    vm.selectedDeviceClass = {};
    vm.discoveredDevices = [];
    vm.wizard = {};
    vm.wizardData = {};

    /*
     * Public Methods
     */
    vm.selectVendor = selectVendor;
    vm.selectDeviceClass = selectDeviceClass;
    vm.discoverDevices = discoverDevices;
    vm.save = save;

  
    /*
     * Private method: _init()
     */
    function _init() {
      _findAllVendors()
        .then(function(vendors) {
          vm.supportedVendors = vendors;
        })
    }

    /*
     * Private method: _findAllVendors()
     */
    function _findAllVendors() {
      return DSVendor
        .findAll();
    }

    /*
     * Private method: _findDeviceClasses(vendor)
     */
    function _findDeviceClasses(vendor) {
      return DSVendor
        .loadRelations(vendor, ['deviceClasses']);
    }


    /*
     * Public method: discoverDevices(deviceClass)
     */
    function discoverDevices() {
      vm.selectedDeviceClass
        .discover()
        .then(function(discoveredDevices) {
          vm.discoveredDevices = discoveredDevices.data;
        });
    }

    /*
     * Public method: selectVendor(vendor)
     */
    function selectVendor(vendor) {
      _findDeviceClasses(vendor)
        .then(function(vendor) {
          vm.selectedVendor = vendor;
        });

      // Go to next wizard step
      vm.wizard.next();
    }

    /*
     * Public method: selectDeviceClass(deviceClass)
     */
    function selectDeviceClass(deviceClass) {
      $log.log('deviceClass', deviceClass);

      vm.selectedDeviceClass = deviceClass;
      vm.wizardData.step1 = deviceClass.getCreateMethod();
      vm.wizardData.step2 = deviceClass.getSetupMethod();

      // Automatically start disocvery of devices if there are no DiscoveryParams
      if(vm.wizardData.step1 &&
         vm.wizardData.step1.title === 'Discovery' &&
         vm.selectedDeviceClass.discoveryParamTypes.length === 0) {
        discoverDevices();
      }

      // Go to next wizard step
      vm.wizard.next();
    }

    /*
     * Public method: save(device)
     */
    function save(device) {
      var deviceData = {};
      deviceData.deviceClassId = vm.selectedDeviceClass.id;

      if(angular.isObject(device)) {
        // For discovered devices only
        deviceData.deviceDescriptorId = device.id;

        // For devices with params
        deviceData.deviceParams = [];
        angular.forEach(vm.selectedDeviceClass.discoveryParamTypeInputs, function(discoveryParamTypeInput) {
          var deviceParam = {};

          deviceParam.name = discoveryParamTypeInput.inputData.name;
          deviceParam.value = discoveryParamTypeInput.inputData.value;

          deviceData.deviceParams.push(deviceParam);
        });
      } else {
        // For devices with params
        deviceData.deviceParams = [];
        angular.forEach(vm.selectedDeviceClass.paramTypeInputs, function(paramTypeInput) {
          var deviceParam = {};

          deviceParam.name = paramTypeInput.inputData.name;
          deviceParam.value = paramTypeInput.inputData.value;

          deviceData.deviceParams.push(deviceParam);
        });
      }

      DSDevice
        .create({
          device: deviceData
        })
        .then(function(device) {
          // TODO: Find a better way to update data-store after create (maybe use lifecycle hook "afterCreate")
          DSDevice
            .findAll({}, {bypassCache:true})
            .then(function(devices) {
              $state.go('guh.devices.master');
            });
        })
        .catch(function(error) {
          $log.error(error);
        });
    }

    _init();

  }

}());