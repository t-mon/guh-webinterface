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
    .module('guh.components.models')
    .factory('Device', DeviceFactory);

  DeviceFactory.$inject = ['$log', 'deviceClassesService', 'devicesService', 'DeviceClass', 'Action', 'Param'];

  function DeviceFactory($log, deviceClassesService, devicesService, DeviceClass, Action, Param) {

    /*
     * Constructor
     */
    function Device(data) {
      this.deviceClassId = data.deviceClassId;
      this.id = data.id;
      this.name = data.name;
      this.params = data.params;
      this.setupComplete = data.setupComplete;
    }

    /*
     * Static methods
     */
    angular.extend(Device, {
      add: add,
      discover: discover,
      find: find,
      findAll: findAll,
      findActions: findActions,
      findDeviceClass: findDeviceClass,
      findStates: findStates,
      remove: remove,
      removeAll: removeAll,
    });

    return Device;


    /*
     * Static method: add()
     */
    function add(deviceClass) {
      return devicesService.add({
        deviceClassId: deviceClass.id,
        descriptorId: deviceClass.descriptorId,
        paramTypes: angular.copy(deviceClass.paramTypes)
      });
    }

    /*
     * Static method: discover()
     */
    function discover(deviceClass) {
      // var clonedDeviceClass = angular.copy(deviceClass);

      // angular.forEach(clonedDeviceClass.discoveryParamTypes, function(paramType, index) {
      //   clonedDeviceClass.discoveryParamTypes[index] = paramType.getDescriptor();
      // });

      // return devicesService.fetchDiscovered({
      //   deviceClassId: clonedDeviceClass.id,
      //   discoveryParams: clonedDeviceClass.discoveryParamTypes
      // });

      var params = [];

      angular.forEach(deviceClass.discoveryParamTypes, function(paramTypeData, index) {
        var param = new Param(paramTypeData);
        params[index] = param.getData();
      });

      return devicesService.fetchDiscovered({
        deviceClassId: deviceClass.id,
        discoveryParams: params
      });
    }

    /*
     * Static method: find(id)
     */
    function find(id) {
      return devicesService
        .fetch(id)
        .then(function(deviceData) {
          return new Device(deviceData);
        });
    }

    /*
     * Static method: findAll()
     */
    function findAll() {
      return devicesService
        .fetchAll()
        .then(function(devicesData) {
          angular.forEach(devicesData, function(deviceData, index) {
            devicesData[index] = new Device(deviceData);
          });
          return devicesData.filter(Boolean);
        });
    }

    /*
     * Static method: findActions()
     */
    function findActions(device) {
      return devicesService
        .fetchActions(device)
        .then(function(actionsData) {
          angular.forEach(actionsData, function(actionData, index) {
            actionsData[index] = new Action(actionData);
          });
          return actionsData.filter(Boolean);
        });
    }

    /*
     * Static method: findDeviceClass()
     */
    function findDeviceClass(device) {
      return deviceClassesService
        .fetch(device.deviceClassId)
        .then(function(deviceClassData) {
          return new DeviceClass(deviceClassData);
        });
    }

    /*
     * Static method: findStates()
     */
    function findStates(device) {
      return devicesService.fetchStates(device);
    }    

    /*
     * Static method: remove()
     */
    function remove(deviceId) {
      return devicesService.remove(deviceId);
    }

    /*
     * Static method: remove()
     */
    function removeAll() {
      $log.log('TODO: implement removeAll method');
    }
  
  }

}());