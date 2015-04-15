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
    .factory('DSDevice', DSDeviceFactory)
    .run(function(DSDevice) {});

  DSDeviceFactory.$inject = ['$log', '$state', 'DS', 'DSHttpAdapter', 'websocketService'];

  function DSDeviceFactory($log, $state, DS, DSHttpAdapter, websocketService) {
    
    var staticMethods = {};

    /*
     * DataStore configuration
     */
    var DSDevice = DS.defineResource({

      // API configuration
      endpoint: 'devices',
      suffix: '.json',

      // Model configuration
      idAttribute: 'id',
      name: 'device',
      relations: {
        hasMany: {
          state: {
            localField: 'states',
            foreignKey: 'deviceId'
          }
        },
        belongsTo: {
          deviceClass: {
            localField: 'deviceClass',
            localKey: 'deviceClassId'
          }
        }
      },

      // Computed properties
      computed: {},

      // Instance methods
      methods: {
        executeAction: executeAction,
        getAction: getAction,
        getEventDescriptor: getEventDescriptor,
        getStateDescriptor: getStateDescriptor,
        remove: remove,
        subscribe: subscribe,
        unsubscribe: unsubscribe
      }

    });

    return DSDevice;


    /*
     * Public method: executeAction()
     */
    function executeAction(actionType) {
      var self = this;
      var options = {};

      options.params = actionType.getParams();
      return DS
        .adapters
        .http
        .POST('api/v1/devices/' + self.id + '/actions/' + actionType.id + '/execute.json', options);
    }

    /*
     * Public method: getAction(actionType)
     */
    function getAction(actionType) {
      var self = this;
      var action = {};
      var ruleActionParams = [];

      ruleActionParams = actionType.getRuleActionParams();
      if(ruleActionParams.length > 0) {
        action.ruleActionParams = ruleActionParams;
      }

      action.actionTypeId = actionType.id;
      action.deviceId = self.id;

      return action;
    }

    /*
     * Public method: getEventDescriptor(eventInput)
     */
    function getEventDescriptor(eventInput) {
      var self = this;
      var eventDescriptor = {};
      var paramDescriptors = [];

      paramDescriptors = eventInput.getParamDescriptors(self.id, eventInput.paramTypes);
      if(paramDescriptors.length > 0) {
        eventDescriptor.paramDescriptors = paramDescriptors;
      }

      eventDescriptor.deviceId = self.id;
      eventDescriptor.eventTypeId = eventInput.id;

      return eventDescriptor;     
    }

    /*
     * Public method: getStateDescriptor(stateInput, stateOperatorValue)
     */
    function getStateDescriptor(stateInput, stateOperatorValue) {
      var self = this;
      var stateDescriptor = {};

      stateDescriptor.deviceId = self.id;
      stateDescriptor.operator = stateOperatorValue;
      stateDescriptor.stateTypeId = stateInput.id;
      stateDescriptor.value = stateInput.inputData.value;

      return stateDescriptor;     
    }

    /*
     * Public method: remove()
     */
    function remove() {
      var self = this;

      return DSDevice
        .destroy(self.id);
    }

    /*
     * Public method: subscribe(deviceId, cb)
     */
    function subscribe(deviceId, cb) {
      $log.log('subscribe device', deviceId, cb);
      return websocketService.subscribe(deviceId, cb);
    }

    /*
     * Public method: unsubscribe(deviceId)
     */
    function unsubscribe(deviceId) {
      $log.log('unsubscribe device', deviceId);
      return websocketService.unsubscribe(deviceId);
    }

  }

}());