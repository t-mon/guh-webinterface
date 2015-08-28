/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                     *
 * Copyright (C) 2015 Lukas Mayerhofer <lukas.mayerhofer@guh.guru>                     *
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


/**
 * @ngdoc interface
 * @name guh.moods.controller:AddTriggerCtrl
 *
 * @description
 * Load and show details of certain mood.
 *
 */

(function(){
  'use strict';

  angular
    .module('guh.moods')
    .controller('AddTriggerCtrl', AddTriggerCtrl);

  AddTriggerCtrl.$inject = ['$log', '$rootScope', 'DSDevice', 'DSEventType', 'DSStateType', 'libs'];

  function AddTriggerCtrl($log, $rootScope, DSDevice, DSEventType, DSStateType, libs) {

    // View data
    var vm = this;

    // Public variables
    vm.rule = {};
    vm.triggerDevices = [];

    vm.selectedTriggerDevice = {};
    vm.selectedTriggerEventType = {};

    vm.selectedEventTypes = {};
    vm.selectedStateTypes = {};

    // Public methods
    vm.selectTrigger = selectTrigger;
    vm.addEventDescriptorParams = addEventDescriptorParams;


    function _init() {
      // Set rule data
      // ...

      // Set devices with actions
      _setTriggerDevices();
    }

    function _setTriggerDevices() {
      var devices = DSDevice.getAll();
      var triggerDevices = devices.filter(_hasTrigger);

      vm.triggerDevices = angular.copy(triggerDevices);
    }

    function _hasTrigger(device) {
      return angular.isDefined(device.deviceClass) && (device.deviceClass.eventTypes.length > 0 || device.deviceClass.stateTypes.length > 0) && device.name.indexOf('mood-toggle') === -1;
    }

    function _getEventDescriptorData(device, eventType, eventTypeParams) {
      var eventDescriptor = {};

      if(angular.isDefined(device) && angular.isDefined(eventType)) {
        eventDescriptor.eventTypeId = eventType.id;
        eventDescriptor.deviceId = device.id;

        if(eventType.paramTypes.length > 0 && angular.isDefined(eventTypeParams)) {
          eventDescriptor.paramDescriptors = eventTypeParams.map(function(eventParam) {
            eventParam.operator = 'ValueOperatorEquals';
            return eventParam;
          });
        }
      }

      return eventDescriptor;
    }

    function _isSelected(eventStateType) {
      var isSelected = false;

      if(DSEventType.is(eventStateType)) {
        if(angular.isDefined(vm.rule.eventDescriptorList)) {
          isSelected = libs._.some(vm.rule.eventDescriptorList, 'eventTypeId', eventStateType.id);
        } else if(angular.isDefined(vm.rule.eventDescriptor)) {
          isSelected = vm.rule.eventDescriptor.eventTypeId === eventStateType.id ? true : false;
        }
      } else if(DSStateType.is(eventStateType)) {

      }

      return isSelected;
    }

    function _removeEventDescriptor(device, eventType) {
      var removedEventDescriptor = {};

      if(angular.isDefined(vm.rule.eventDescriptorList)) {
        removedEventDescriptor = libs._.remove(vm.rule.eventDescriptorList, function(eventDescriptor) {
          return (eventDescriptor.deviceId === device.id && eventDescriptor.eventTypeId === eventType.id);
        });
      } else if(angular.isDefined(vm.rule.eventDescriptor)) {
        if(delete vm.rule.eventDescriptor) {
          var removedEventDescriptor = vm.rule.eventDescriptor;
        }
      }

      return removedEventDescriptor;
    }

    function _removeStateEvaluator(stateEvaluator) {

    }

    function _removeStateType(stateType) {

    }

    function selectTrigger(device, eventStateType) {
      if(DSEventType.is(eventStateType)) {
        var eventType = eventStateType;

        // $log.log('device', device);
        // $log.log('eventStateType', eventStateType);
        // $log.log('vm.selectedEventTypes', vm.selectedEventTypes);

        if(vm.selectedEventTypes[device.id] && vm.selectedEventTypes[device.id][eventType.id]) {
          // Remove trigger
          _removeEventDescriptor(device, eventType);
          // $log.log('_isSelected(eventType)', _isSelected(eventType));
          vm.selectedEventTypes[device.id][eventType.id] = _isSelected(eventType);
        } else {
          // Add eventDescriptor
          var eventDescriptor = _getEventDescriptorData(device, eventType);

          if(angular.isDefined(vm.rule.eventDescriptorList)) {
            vm.rule.eventDescriptorList.push(eventDescriptor);
          } else if(angular.isDefined(vm.rule.eventDescriptor)) {
            vm.rule.eventDescriptorList = [];

            vm.rule.eventDescriptorList.push(vm.rule.eventDescriptor);    
            delete vm.rule.eventDescriptor;

            vm.rule.eventDescriptorList.push(eventDescriptor);            
          } else {
            vm.rule.eventDescriptor = eventDescriptor;
          }

          if(eventType.paramTypes.length > 0) {
            vm.selectedTriggerDevice = device;
            vm.selectedTriggerEventType = eventType;
            $rootScope.$broadcast('wizard.next', 'addTriggerDetails');
          }

          // Add "selected" class
          if(!vm.selectedEventTypes[device.id]) {
            vm.selectedEventTypes[device.id] = {};
          }
          vm.selectedEventTypes[device.id][eventType.id] = _isSelected(eventType);
        }
      } else if(DSStateType.is(eventStateType)) {
        var stateType = eventStateType;

        if(vm.selectedEventTypes[device.id] && vm.selectedEventTypes[device.id][stateType.id]) {
          // Remove trigger
          _removeStateEvaluator(stateType);
        } else {
          
        }
      }

      $log.log('vm.rule', vm.rule);
    }

    function addEventDescriptorParams(params) {
      var eventDescriptor = _getEventDescriptorData(vm.selectedTriggerDevice, vm.selectedTriggerEventType, params);

      if(angular.isDefined(vm.rule.eventDescriptorList)) {
        vm.rule.eventDescriptorList[vm.rule.eventDescriptorList.length - 1] = eventDescriptor;
      } else if(angular.isDefined(vm.rule.eventDescriptor)) {
        vm.rule.eventDescriptor = eventDescriptor;
      }

      $log.log('vm.rule', vm.rule);

      $rootScope.$broadcast('wizard.prev', 'addTriggerDetails');
    }


    _init();

  }

}());
