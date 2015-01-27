/* Copyright (C) 2015 guh
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 *
 */

(function(){
  "use strict";

  angular
    .module('guh.components.api')
    .factory('devicesService', devicesService);

  devicesService.$inject = ['$log', 'Restangular'];

  function devicesService($log, Restangular) {
    var service = {
      add: add,
      fetchDiscovered: fetchDiscovered,
      executeAction: executeAction,
      fetchAll: fetchAll,
      fetch: fetch,
      fetchActions: fetchActions,
      fetchStates: fetchStates,
      remove: remove
    },
    api = Restangular.all('devices');
    

    return service;

    // Add a device
    function add(deviceClass) {
      return api.customPOST({
        // TODO: Change format: e.g. deviceClassId => device_class_id
        'device': {
          'deviceClassId': deviceClass.deviceClassId,
          'deviceDescriptorId': deviceClass.descriptorId,
          'deviceParams': deviceClass.paramTypes
        }
      });
    }

    // Execute an action
    function executeAction(action) {
      return api.one(action.deviceId).one('actions', action.actionTypeId).all('execute').post({
        'device_id': action.deviceId,
        'id': action.actionTypeId,
        'action_params': action.params
      });
    }

    // Fetch discovered devices
    function fetchDiscovered(deviceClass) {

      // var discoveryParams = [];
      // angular.forEach(discoveryParamTypes, function(discoveryParamType) {
      //   delete discoveryParamType.type;
      //   discoveryParams.push(discoveryParamType);
      // });
      // discoveryParams = angular.toJson(discoveryParams);

      return api.customGETLIST('discover', {'device_class_id': deviceClass.deviceClassId, 'discovery_params': angular.toJson(deviceClass.discoveryParams)});
      // return api.customGETLIST('discover', {'device_class_id': deviceClass.deviceClassId, 'discovery_params': deviceClass.discoveryParams});
    }

    // Fetch device list (without actions or states)
    function fetchAll() {
      return api.getList();
    }

    // Fetch device (without actions or states)
    function fetch(id) {
      return api.get(id);
    }

    // Fetch actions of certain device
    function fetchActions(device) {
      return Restangular.one('devices', device.id).getList('actions');
    }

    // Fetch states of certain device
    function fetchStates(device) {
      return Restangular.one('devices', device.id).getList('states');
    }

    // Remove device
    function remove(deviceId) {
      $log.log('remove()');
      return api.one(deviceId).remove();
    }

  }

}());