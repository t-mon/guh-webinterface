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
    .factory('DSEventType', DSEventTypeFactory)
    .run(function(DSEventType) {});

  DSEventTypeFactory.$inject = ['$log', 'DS', 'ModelsHelper'];

  function DSEventTypeFactory($log, DS, ModelsHelper) {

    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSEventType = DS.defineResource({
      
      // API configuration
      endpoint: 'event_types',
      suffix: '.json',
      
      // Model configuration
      idAttribute: 'id',
      name: 'eventType',
      relations: {
        belongsTo: {
          deviceClass: {
            localField: 'deviceClass',
            localKey: 'deviceClassId',
            parent: true
          }
        }
      },

      // Computed properties
      computed: {
        inputData: ['name', 'paramTypes', _getInputData],
      },

      // Instance methods
      methods: {
        getParamDescriptors: getParamDescriptors
      },

      // Lifecycle Hooks
      afterInject: _afterInject

    });

    return DSEventType;


    /*
     * Private method: _getTriggerPhrase(name, paramTypes)
     */
    function _getTriggerPhrase(name, paramTypes) {
      var phrase = 'When ' + name;

      if(paramTypes.length === 0) {
        phrase = phrase + ' is detected.';
      } else {
        phrase = phrase + ' is detcted and Parameters are...';
      }
      return phrase;
    }

    /*
     * Private method: _getInputData(name, paramTypes)
     */
    function _getInputData(name, paramTypes) {
      var inputData = {};
      
      inputData.triggerPhrase = _getTriggerPhrase(name, paramTypes);
      inputData.unit = ModelsHelper.getUnit(name);

      return inputData;
    }


    /*
     * Private method: _afterInject(resource, eventType)
     */
    function _afterInject(resource, eventType) {
      var paramTypes = eventType.paramTypes;

      // Enhance paramTypes with following attributes: operator, templateUrl, value
      angular.forEach(paramTypes, function(paramType) {
        var templateData = ModelsHelper.getTemplateData(paramType);

        paramType.inputData = {
          operator: 'ValueOperatorEquals',
          templateUrl: templateData.templateUrl,
          value: templateData.value
        };
      });
    }


    /*
     * Public method: getParamDescriptors(deviceId, paramTypes)
     */
    function getParamDescriptors(deviceId, paramTypes) {
      $log.log('getParamDescriptors', paramTypes);
      var paramDescriptors = [];

      angular.forEach(paramTypes, function(paramType) {
        paramDescriptors.push({
          name: paramType.name,
          operator: paramType.inputData.operator,
          value: paramType.inputData.value
        });
      });

      return paramDescriptors;
    }

  }

}());