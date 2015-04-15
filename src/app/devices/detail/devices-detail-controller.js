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

  DevicesDetailController.$inject = ['$log', '$scope', '$state', '$stateParams', '$q', 'DSDevice', 'DSDeviceClass', 'DSState'];

  function DevicesDetailController($log, $scope, $state, $stateParams, $q, DSDevice, DSDeviceClass, DSState) {

    /*
     * Public variables
     */
    var vm = this;
    var currentDevice = {};

    /*
     * Public methods
     */
    vm.executeAction = executeAction;
    vm.remove = remove;

    /*
     * Private method: _init()
     */
    function _init() {
      _findDevice($stateParams.id)
        .then(function(device) {
          currentDevice = device;

          vm.deviceClass = {};
          vm.deviceClassId = device.deviceClassId;
          vm.id = device.id;
          vm.name = device.name;
          vm.params = device.params;
          vm.setupComplete = device.SetupComplete;
          vm.states = device.states;

          // Subscribe to websocket messages
          device.subscribe(device.id, function(message) {
            if(message.notification === 'Devices.StateChanged') {
              angular.forEach(device.states, function(state, index) {
                if(message.params.stateTypeId === state.stateTypeId && message.params.deviceId === vm.id) {
                  DSState.inject([{stateTypeId: message.params.stateTypeId, value: message.params.value}]);
                }
              });
            }
          });

          return device;
        })
        .then(_findDeviceClass)
        .then(function(deviceClass) {
          vm.deviceClass = deviceClass;
        });
    }

    /*
     * Private method: _findDevice(deviceId)
     */
    function _findDevice(deviceId) {
      return DSDevice
        .find(deviceId)
        .then(_findStates);
    }

    /*
     * Private method: _findStates(device)
     */
    function _findStates(device) {
      return DSDevice
        .loadRelations(device, ['states']);
    }

    /*
     * Private method: _findDeviceClass(device)
     */
    function _findDeviceClass(device) {
      return DSDevice
        .loadRelations(device, ['deviceClass'])
        .then(_findVendor);
    }

    /*
     * Private method: _findVendor(device)
     */
    function _findVendor(device) {
      return DSDeviceClass
        .loadRelations(device.deviceClass, ['vendor']);
    }

    /*
     * Public method: executeAction(actionType)
     */
    function executeAction(actionType) {
      currentDevice
        .executeAction(actionType)
        .then(function(response) {
          $log.log('Action succefully executed.', response);
        })
        .catch(function(error) {
          $log.error(error.data.errorMessage);
        });
    }

    /*
     * Public method: remove()
     */
    function remove() {
      currentDevice
        .remove()
        .then(function() {
          $state.go('guh.devices.master');
        })
        .catch(function(error) {
          $log.error(error.data.errorMessage);
        });
    }

    _init();

  }
}());