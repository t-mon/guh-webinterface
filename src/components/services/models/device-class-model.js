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
    .factory('DSDeviceClass', DSDeviceClassFactory)
    .run(function(DSDeviceClass) {});

  DSDeviceClassFactory.$inject = ['$log', 'DS', 'DSHttpAdapter', 'ModelsHelper'];

  function DSDeviceClassFactory($log, DS, DSHttpAdapter, ModelsHelper) {

    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSDeviceClass = DS.defineResource({
      
      // API configuration
      endpoint: 'device_classes',
      suffix: '.json',

      // Model configuration
      idAttribute: 'id',
      name: 'deviceClass',
      relations: {
        hasMany: {
          actionType: {
            localField: 'actionTypes',
            foreignKey: 'deviceClassId'
          },
          eventType: {
            localField: 'eventTypes',
            foreignKey: 'deviceClassId'
          },
          stateType: {
            localField: 'stateTypes',
            foreignKey: 'deviceClassId'
          }
        },
        belongsTo: {
          vendor: {
            localField: 'vendor',
            localKey: 'vendorId',
            parent: true
          }
        }
      },

      // Computed properties
      computed: {
        // TODO: Use afterInject method for this (solution for hook not loaded when relation is loaded, problem: https://github.com/js-data/js-data/issues/35)
        discoveryParamTypeInputs: ['discoveryParamTypes', _getDiscoveryParamTypeInputs],
        paramTypeInputs: ['paramTypes', _getParamTypeInputs]
      },

      // Instance methods
      methods: {
        discover: discover,
        getCreateMethod: getCreateMethod,
        getSetupMethod: getSetupMethod
      },

      // Lifecycle hooks
      // afterInject: _afterInject

    });

    return DSDeviceClass;


    /*
     * Private method: _getEnhancedInputs(inputs)
     */
    function _getEnhancedInputs(inputs) {
      angular.forEach(inputs, function(input) {
        var templateData = ModelsHelper.getTemplateData(input);
        
        input.inputData = {};

        input.inputData.name = input.name;
        input.inputData.operator = 'ValueOperatorEquals';
        input.inputData.templateUrl = templateData.templateUrl;
        input.inputData.value = templateData.value;
      });

      return inputs;
    }

    /*
     * Private method: _afterInject(resource, deviceClass)
     */
    // function _afterInject(resource, deviceClass) {
    //   // Enhance discoveryParamTypes with following attributes: operator, templateUrl, value
    //   angular.forEach(deviceClass.discoveryParamTypes, function(discoveryParamType) {
    //     var templateData = ModelsHelper.getTemplateData(discoveryParamType);

    //     discoveryParamType.inputData = {
    //       operator: 'ValueOperatorEquals',
    //       templateUrl: templateData.templateUrl,
    //       value: templateData.value
    //     };
    //   });

    //   // Enhance paramTypes with following attributes: operator, templateUrl, value
    //   angular.forEach(deviceClass.paramTypes, function(paramType) {
    //     var templateData = ModelsHelper.getTemplateData(paramType);

    //     paramType.inputData = {
    //       operator: 'ValueOperatorEquals',
    //       templateUrl: templateData.templateUrl,
    //       value: templateData.value
    //     };
    //   });

    //   $log.log('deviceClass', deviceClass);
    // }

    /*
     * Private method: _getDiscoveryParamTypeInputs(discoveryParamTypes)
     */
    function _getDiscoveryParamTypeInputs(discoveryParamTypes) {
      var discoveryParamTypeInputs = angular.copy(discoveryParamTypes);

      return _getEnhancedInputs(discoveryParamTypeInputs);
    }

    /*
     * Private method: _getParamTypeInputs(paramTypes)
     */
    function _getParamTypeInputs(paramTypes) {
      var paramTypeInputs = angular.copy(paramTypes);

      return _getEnhancedInputs(paramTypeInputs);
    }


    /*
     * Public method: discover()
     */
    function discover() {
      var self = this;
      var discoveryParams = [];

      angular.forEach(self.discoveryParamTypeInputs, function(discoveryParamTypeInput, index) {
        var discoveryParam = {};

        discoveryParam.name = discoveryParamTypeInput.inputData.name;
        discoveryParam.value = discoveryParamTypeInput.inputData.value;

        discoveryParams.push(discoveryParam);
      });

      return DSHttpAdapter.GET('/api/v1/device_classes/' + self.id + '/discover.json', {
        params: {
          'device_class_id': self.id,
          'discovery_params': angular.toJson(discoveryParams)
        }
      });
    }

    /*
     * Public method: getCreateMethod()
     */
    function getCreateMethod() {
      var self = this;
      var basePath = 'app/devices/add/pairing-templates/';
      var createMethodData = null;

      if(self.createMethods.indexOf('CreateMethodDiscovery') > -1) {
        createMethodData = {
          title: 'Discovery',
          template: basePath + 'devices-add-create-discovery.html'
        };
      } else if(self.createMethods.indexOf('CreateMethodUser') > -1) {
        createMethodData = {
          title: 'User',
          template: basePath + 'devices-add-create-user.html'
        };
      } else if(self.createMethods.indexOf('CreateMethodAuto') > -1) {
        createMethodData = {
          title: 'Auto',
          template: null
        };
      } else {
        $log.error('CreateMethod "' + createMethod + '" not implemented.');
      }

      return createMethodData;
    }

    /*
     * Public method: getSetupMethod()
     */
    function getSetupMethod() {
      var self = this;
      var basePath = 'app/devices/add/pairing-templates/';
      var setupMethodData = {};

      switch(self.setupMethod) {
        case 'SetupMethodJustAdd':
          break;
        case 'SetupMethodDisplayPin':
          setupMethodData = {
            title: 'Display Pin',
            template: basePath + 'devices-add-setup-display-pin.html'
          };
          break;
        case 'SetupMethodEnterPin':
          setupMethodData = {
            title: 'Enter Pin',
            template: basePath + 'devices-add-setup-enter-pin.html'
          };
          break;
        case 'SetupMethodPushButton':
          setupMethodData = {
            title: 'Enter Pin',
            template: basePath + 'devices-add-setup-push-button.html'
          };
          break;
        default:
          $log.error('SetupMethod "' + setupMethod + '" not implemented.');
          break;
      }

      return setupMethodData;
    }

  }

}());