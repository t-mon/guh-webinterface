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