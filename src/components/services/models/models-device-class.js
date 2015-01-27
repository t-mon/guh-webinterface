/* Copyright (C) 2015 guh
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 *
 */

(function(){
  "use strict";

  angular
    .module('guh.components.models')
    .factory('DeviceClass', DeviceClassFactory);

  DeviceClassFactory.$inject = ['$log', '$http', 'deviceClassesService', 'Action', 'ActionType', 'Event', 'StateType', 'Param'];

  function DeviceClassFactory($log, $http, deviceClassesService, Action, ActionType, Event, StateType, Param) {

    /*
     * Constructor
     */
    function DeviceClass(data) {
      // Create ActionTypes
      data.actions = [];
      angular.forEach(data.actionTypes, function(actionTypeData, index) {
        var action = new Action(actionTypeData);
        data.actions[index] = action;
        data.actionTypes[index] = action.getType();
      });

      // Create ParamTypes
      data.discoveryParams = [];
      angular.forEach(data.discoveryParamTypes, function(discoveryParamTypeData, index) {
        var param = new Param(discoveryParamTypeData);
        data.discoveryParams[index] = param;
        data.discoveryParamTypes[index] = param.getType();
      });

      // Create EventTypes
      angular.forEach(data.eventTypes, function(eventTypeData, index) {
        var event = new Event(eventTypeData);
        data.eventTypes[index] = event.getType();
      });

      // Create ParamTypes
      angular.forEach(data.paramTypes, function(paramTypeData, index) {
        var param = new Param(paramTypeData);
        data.paramTypes[index] = param.getType();
      });

      // Create StateTypes
      angular.forEach(data.stateTypes, function(stateTypeData, index) {
        data.stateTypes[index] = new StateType(stateTypeData);
      });

      this.actions = data.actions;
      this.actionTypes = data.actionTypes;
      this.createMethods = data.createMethods;
      this.discoveryParams = data.discoveryParams;
      this.discoveryParamTypes = data.discoveryParamTypes;
      this.eventTypes = data.eventTypes;
      this.id = data.id;
      this.name = data.name;
      this.paramTypes = data.paramTypes;
      this.setupMethod = data.setupMethod;
      this.stateTypes = data.stateTypes;
      this.vendorId = data.vendorId;
    }

    /*
     * Public prototype methods
     */
    angular.extend(DeviceClass.prototype, {
      getTemplateUrl: getTemplateUrl,
      getCreateMethod: getCreateMethod,
      getSetupMethod: getSetupMethod
    });

    /*
     * Static methods
     */
    angular.extend(DeviceClass, {
      find: find,
      findAll: findAll
    });

    return DeviceClass;


    /*
     * Private method: _checkTemplateUrl(templateUrl)
     */
    function _checkTemplateUrl(templateUrl) {
      var basePath = 'components/directives/guh-device-class/templates/';

      if(templateUrl !== undefined && templateUrl !== '') {  
        var request = new XMLHttpRequest();

        request.open('HEAD', templateUrl, false);
        request.send();

        if(request.status === 200) {
          return templateUrl;
        } else {
          return basePath + 'default.html';
        }
      } else {
        return basePath + 'default.html';
      }
    }


    /*
     * Public prototype method: getCreateMethod()
     */
    function getCreateMethod() {
      /* jshint validthis:true */
      var basePath = 'app/devices/add/pairing-templates/';
      var createMethods = this.createMethods;
      var result = {
        title: '',
        templateUrl: ''
      };

      angular.forEach(createMethods, function(createMethod) {
        switch(createMethod) {
          case 'CreateMethodDiscovery':
            result = {
              title: 'Discovery',
              templateUrl: basePath + 'devices-add-create-discovery.html'
            };
            break;
          case 'CreateMethodUser':
            result = {
              title: 'User',
              templateUrl: basePath + 'devices-add-create-user.html'
            };
            break;
          case 'CreateMethodAuto':
            break;
          default:
            $log.error('CreateMethod "' + createMethod + '" not implemented.');
            break;
        }
      });

      return result;
    }

    /*
     * Public prototype method: getSetupMethod()
     */
    function getSetupMethod() {
      /* jshint validthis:true */
      var setupMethod = this.setupMethod;

      // Ignore if setupMethod === SetupMethodJustAdd
      if(setupMethod === 'SetupMethodJustAdd') {
        return false;
      } else {
        return setupMethod;
      }
    }

    /*
     * Public prototype method: getTemplateUrl()
     */
    function getTemplateUrl() {
      /* jshint validthis:true */
      var basePath = 'components/directives/guh-device-class/templates/';
      var extension = '.html';
      // Example: 'Elro Remote' => 'elro-remote'
      var templateName = this
        .name
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '');

      return _checkTemplateUrl(basePath + templateName + extension);
    }


    /*
     * Static method: find(id)
     */
    function find(id) {
      return deviceClassesService
        .fetch(id)
        .then(function(deviceClassData) {
          return new DeviceClass(deviceClassData);
        });
    }


    /*
     * Static method: findAll()
     */
    function findAll() {
      return deviceClassesService
        .fetchAll()
        .then(function(deviceClassesData) {
          angular.forEach(deviceClassesData, function(deviceClassData, index) {
            deviceClassesData[index] = new DeviceClass(deviceClassData);
          });
          return deviceClassesData.filter(Boolean);
        });
    }

  }

}());