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
    .controller('DevicesDetailController', DevicesDetailController);

  DevicesDetailController.$inject = ['$log', '$scope', '$stateParams', '$state', '$q', 'DeviceClass', 'Device'];

  function DevicesDetailController($log, $scope, $stateParams, $state, $q, DeviceClass, Device) {

    /*
     * Public variables
     */
    var vm = this;

    /*
     * Public methods
     */

    vm.executeAction = executeAction;
    vm.remove = remove;

    /*
     * Private methods
     */
    function _init() {
      _getDevice($stateParams.id)
        .then(_getDeviceClass)
        .catch(_reportErrors);
    }

    function _getDevice(id) {
      return Device.find(id);
    }

    function _getDeviceClass(device) {
      return DeviceClass
        .find(device.deviceClassId)
        .then(function(deviceClass) {
          // Set deviceId for each Action
          angular.forEach(deviceClass.actions, function(action) {
            action.setDeviceId(device.id);
          });

          vm.deviceClass = deviceClass;
          vm.deviceClassId = device.deviceClassId;
          vm.id = device.id;
          vm.name = device.name;
          vm.params = device.params;
          vm.setupComplete = device.setupComplete;
        });
    }

    function _reportErrors(error) {
      $log.error(error);
    }

    /*
     * Public method: executeAction(action)
     */

    function executeAction(action) {
      action.execute();
    }

    /*
     * Public method: remove()
     */
    function remove() {
      Device.remove(vm.id).then(function() {
        $state.go('guh.devices.master');
      });
    }

    _init();

  }
}());