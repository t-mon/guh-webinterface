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
    .controller('DevicesMasterController', DevicesMasterController);

  DevicesMasterController.$inject = ['$log', 'DSDevice', 'DSDeviceClass'];

  function DevicesMasterController($log, DSDevice, DSDeviceClass) {

    /*
     * Public variables
     */
    var vm = this;
    vm.configured = [];

    /*
     * Private method: _init()
     */
    function _init() {
      _findAllDevices()
        .then(_findDeviceClass)
        .then(function(devices) {
          vm.configured = devices;
        })
        .catch(function(error) {
          $log.error(error);
        });
    }

    /*
     * Private method: _findAllDevices()
     */
    function _findAllDevices() {
      return DSDevice
        .findAll();
    }

    /*
     * Private method: _findDeviceClass(devices)
     */
    function _findDeviceClass(devices) {
      return angular.forEach(devices, function(device) {
        return DSDevice
          .loadRelations(device, ['deviceClass'])
          .then(_findVendor);
      });
    }

    /*
     * Private method: _findVendor(device)
     */
    function _findVendor(device) {
      return DSDeviceClass
        .loadRelations(device.deviceClass, ['vendor']);
    }

    _init();

  }

}());