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
        'params': action.params
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