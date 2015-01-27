/* Copyright (C) 2015 guh
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 *
 */

(function(){
"use strict";

  angular
    .module('guh.rules')
    .controller('RulesAddController', RulesAddController);

  RulesAddController.$inject = ['$log', '$state', 'DeviceClass', 'Device', 'Rule', 'Action', 'Event', 'StateDescriptor'];

  function RulesAddController($log, $state, DeviceClass, Device, Rule, Action, Event, StateDescriptor) {
    // Private variables
    var serverData = {
      eventDescriptors: [],
      stateDescriptors: [],
      actions: [],
    };

    // Public variables
    var vm = this;
    angular.extend(vm, {
      show: {
        addEvent: false,
        addState: false,
        addAction: false
      },
      eventDescriptors: [],
      stateDescriptors: [],
      actions: [],
      devicesWithEventTypes: [],
      devicesWithStateTypes: [],
      devicesWithActions: [],
      currentDevice: {},
      currentDeviceClass: {}
    });

    // Public methods
    angular.extend(vm, {
      addEvent: addEvent,
      addState: addState,
      addAction: addAction,
      saveRule: saveRule,
      selectDevice: selectDevice,
      saveAction: saveAction,
      saveEventDescriptor: saveEventDescriptor,
      saveStateDescriptor: saveStateDescriptor
    });


    /*
     * Private methods
     */

    function _resetShow() {
      vm.show.addEvent = false;
      vm.show.addState = false;
      vm.show.addAction = false;
    }

    function _resetDevices() {
      vm.devicesWithEventTypes = [];
      vm.devicesWithStateTypes = [];
      vm.devicesWithActions = [];
    }

    function _loadDevices() {
      _resetDevices();

      return Device
        .findAll()
        .then(function(devices) {
          // Iterate over all devices to add deviceClass to each of them
          angular.forEach(devices, function(device) {
            DeviceClass
              .find(device.deviceClassId)
              .then(function(deviceClass) {
                device.deviceClass = deviceClass;

                if(deviceClass.eventTypes.length !== 0) {
                  vm.devicesWithEventTypes.push(device);
                }

                if(deviceClass.stateTypes.length !== 0) {
                  vm.devicesWithStateTypes.push(device);
                }

                if(deviceClass.actionTypes.length !== 0) {
                  vm.devicesWithActions.push(device);
                }
              });
          });
        });
    }


    /*
     * Public methods
     */

    function addEvent() {
      // Set devices that have EventTypes defined
      _loadDevices();

      _resetShow();
      vm.show.addEvent = true;
    }

    function addState() {
      // Set devices that have EventTypes defined
      _loadDevices();

      _resetShow();
      vm.show.addState = true;
    }

    function addAction() {
      // Set devices that have EventTypes defined
      _loadDevices();

      _resetShow();
      vm.show.addAction = true;
    }

    function saveRule() {
      // Check stateDescriptors and create stateEvaluator
      var stateEvaluator = {};

      if(serverData.stateDescriptors.length > 1) {
        stateEvaluator.childEvaluators = [];

        var childStateEvaluator = {};
        angular.forEach(serverData.stateDescriptors, function(stateDescriptor) {
          childStateEvaluator.stateDescriptor = stateDescriptor;
          stateEvaluator.childEvaluators.push(childStateEvaluator);
        });
        stateEvaluator.operator = 'StateOperatorOr';
      } else if(serverData.stateDescriptors) {
        stateEvaluator.stateEvaluator = serverData.stateDescriptors;
      }

      Rule
        .add(serverData.eventDescriptors, stateEvaluator, serverData.actions)  
        .then(function() {
          $state.go('guh.rules.master');
        });
    }

    function selectDevice(device) {
      vm.currentDevice = device;
    }

    function saveAction(actionData) {
      var action = new Action(actionData);
      var newAction = {
        name: actionData.name,
        device: vm.currentDevice,
        data: action
      };

      action.setDeviceId(vm.currentDevice.id);

      // newAction[actionData.name] = action;
      serverData.actions.push(action.getData());
      vm.actions.push(newAction);

      _resetShow();
    }

    function saveEventDescriptor(eventTypeData) {
      var event = new Event(eventTypeData);
      event.setDeviceId(vm.currentDevice.id);
      var eventDescriptor = event.getDescriptor();
      var newEvent = {
        name: eventTypeData.name,
        device: vm.currentDevice,
        data: eventDescriptor
      };

      // newEvent[eventTypeData.name] = eventDescriptor;
      serverData.eventDescriptors.push(eventDescriptor);
      vm.eventDescriptors.push(newEvent);

      _resetShow();
    }

    function saveStateDescriptor(stateTypeData) {
      var stateDescriptor = new StateDescriptor(vm.currentDevice.id, stateTypeData);
      var newState = {
        name: stateTypeData.name,
        device: vm.currentDevice,
        data: stateDescriptor
      };

      // newState[stateTypeData.name] = stateDescriptor;
      serverData.stateDescriptors.push(stateDescriptor);
      vm.stateDescriptors.push(newState);

      _resetShow();
    }
  }

}());