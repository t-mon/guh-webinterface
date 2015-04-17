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
    .module('guh.rules')
    .controller('RulesAddController', RulesAddController);

  RulesAddController.$inject = ['$log', '$state', 'DSRule', 'DSDevice', 'DSDeviceClass', 'DSEventType', 'DSStateType'];

  function RulesAddController($log, $state, DSRule, DSDevice, DSDeviceClass, DSEventType, DSStateType) {

    /*
     * Private variables
     */
    var valueOperators = {
      is: {
        id: 1,
        label: 'is',
        values: ['ValueOperatorEquals']
      },
      isNot: {
        id: 2,
        label: 'is not',
        values: ['ValueOperatorNotEquals']
      },
      isGreaterThan: {
        id: 3,
        label: 'is greater than',
        values: ['ValueOperatorGreater']
      },
      isLessThan: {
        id: 4,
        label: 'is less than',
        values: ['ValueOperatorLess']
      },
      between: {
        id: 5,
        label: 'is between',
        values: ['ValueOperatorGreaterOrEqual', 'ValueOperatorLessOrEqual']
      }
    };

    /*
     * Public variables
     */

    var vm = this;
    
    vm.show = {
      addTrigger: false,
      addAction: false
    };

    vm.ruleWizard = {};
    vm.triggerWizard = {};
    vm.actionWizard = {};
    
    vm.availableTriggerDevices = [];
    vm.currentTrigger = {};
    vm.triggerStateOne = null;
    vm.triggerStateTwo = null;
    vm.savedTriggers = [];

    vm.availableActionDevices = [];
    vm.currentAction = {};
    vm.exitAction = false;
    vm.savedActions = [];
    vm.savedExitActions = [];

    vm.rule = {
      actions: [],
      enabled: false,
      eventDescriptors: [],
      exitActions: [],
      name: '',
      stateDescriptors: [],
      stateEvaluator: {}
    };

    vm.stateOperator = valueOperators.is;


    /*
     * Public methods
     */

    vm.listTrigger = listTrigger;
    vm.hasState = hasState;
    vm.addTrigger = addTrigger;
    vm.selectTrigger = selectTrigger;
    vm.isState = isState;
    vm.saveTrigger = saveTrigger;

    vm.listActions = listActions;
    vm.addAction = addAction;
    vm.selectAction = selectAction;
    vm.saveAction = saveAction;

    vm.saveRule = saveRule;

    vm.setStateOperator = setStateOperator;

    function setStateOperator() {
      if(vm.stateOperator.label === 'is between') {
        vm.triggerStateTwo = angular.copy(vm.currentTrigger);
      }
    }


    /*
     * Private methods
     */

    function _init() {
      _resetView();
      _getConfiguredDevices();
    }

    function _resetView() {
      vm.show.addTrigger = false;
      vm.show.addAction = false;
      vm.currentTriggerDevice = {};
    }

    function _resetStates() {
      // vm.triggerStateOne = null;
      vm.triggerStateTwo = null;
      vm.stateOperator = valueOperators.is;
    }

    function _getConfiguredDevices() {
      return DSDevice
        .findAll()
        .then(function(devices) {
          angular.forEach(devices, function(device) {
            _getDeviceClass(device);
          });
        });
    }

    function _getDeviceClass(device) {
      return DSDevice
        .loadRelations(device, ['deviceClass'])
        .then(_setAvailableItem);
    }

    function _setAvailableItem(device) {
      var deviceClass = device.deviceClass;

      if(deviceClass.eventTypes.length > 0 || deviceClass.stateTypes.length > 0) {
        _addAvailableTrigger(device);
      }

      if(deviceClass.actionTypes.length > 0) {
        _addAvailableAction(device);
      }
    }

    function _addAvailableTrigger(device) {
      vm.availableTriggerDevices.push(device);
    }

    function _setCurrentTrigger(triggerDevice, triggerType) {
      vm.currentTrigger = {
        triggerDevice: triggerDevice,
        triggerType: triggerType
      };

      vm.triggerEvent = angular.copy(vm.currentTrigger);
      vm.triggerStateOne = angular.copy(vm.currentTrigger);
    }

    function _addAvailableAction(device) {
      vm.availableActionDevices.push(device);
    }

    function _setCurrentAction(actionDevice, actionType) {
      vm.currentAction = {
        actionDevice: actionDevice,
        actionType: actionType
      };
    }

    function _setAvailableOperators(type) {
      switch(type) {
        case 'bool':
          vm.availableStateOperators = [
            valueOperators.is
          ];
          name = name;
        case 'QString':
          vm.availableStateOperators = [
            valueOperators.is
          ];
          break;
        case 'int':
        case 'uint':
        case 'double':
          vm.availableStateOperators = [
            valueOperators.is,
            valueOperators.isNot,
            valueOperators.isGreaterThan,
            valueOperators.isLessThan,
            valueOperators.between
          ];
          break;
        default:
          vm.availableStateOperators = valueOperators;
          break;
      }
    }

    function _getStateEvaluator() {
      var operator = 'StateOperatorAnd';
      var stateDescriptor = vm.rule.stateDescriptors.pop();

      if(vm.rule.stateDescriptors.length >= 1) {
        var childEvaluator = {
          operator: operator,
          stateDescriptor: stateDescriptor
        };

        if(!vm.rule.stateEvaluator.childEvaluators) {
          vm.rule.stateEvaluator.childEvaluators = [];
        }

        vm.rule.stateEvaluator.childEvaluators.push(childEvaluator);
        _getStateEvaluator();
      } else {
        vm.rule.stateEvaluator.operator = operator;
        vm.rule.stateEvaluator.stateDescriptor = stateDescriptor;
      }
    }


    /*
     * Public methods: Definition
     */

    function listTrigger() {
      _resetView();
      _resetStates();

      vm.ruleWizard.goToStep(1);
    }

    function hasState(eventType) {
      var state = false;
      var stateTypes = eventType.deviceClass.stateTypes;

      // Check if eventType depends on a stateType
      angular.forEach(stateTypes, function(stateType) {
        if(eventType.id === stateType.id) {
          state = true;
        }
      });

      return state;
    }

    function addTrigger() {
      vm.show.addAction = false;
      vm.show.addTrigger = true;

      _resetStates();
      vm.triggerWizard.goToStep(1);
    }

    function selectTrigger(triggerDevice, triggerType) {
      _setAvailableOperators(triggerType.type);
      _setCurrentTrigger(triggerDevice, triggerType);

      vm.triggerWizard.next();
    }

    function isState() {
      return DSStateType.is(vm.currentTrigger.triggerType);
    }

    function saveTrigger(triggerDevice, triggerType) {
      if(triggerDevice && triggerType) {
        _setCurrentTrigger(triggerDevice, triggerType);
      }

      if(DSEventType.is(vm.currentTrigger.triggerType)) {
        var eventDescriptor = vm.currentTrigger.triggerDevice.getEventDescriptor(vm.triggerEvent.triggerType);

        vm.savedTriggers.push(vm.currentTrigger);
        vm.rule.eventDescriptors.push(eventDescriptor);
      } else {
        if(vm.triggerStateTwo !== null) {
          var stateDescriptorOne = vm.triggerStateOne.triggerDevice.getStateDescriptor(vm.triggerStateOne.triggerType, vm.stateOperator.values[0]);
          var stateDescriptorTwo = vm.triggerStateTwo.triggerDevice.getStateDescriptor(vm.triggerStateTwo.triggerType, vm.stateOperator.values[1]);

          vm.savedTriggers.push(vm.currentTrigger);
          vm.rule.stateDescriptors.push(stateDescriptorOne);
          vm.rule.stateDescriptors.push(stateDescriptorTwo);
        } else {
          var stateDescriptorOne = vm.triggerStateOne.triggerDevice.getStateDescriptor(vm.triggerStateOne.triggerType, vm.stateOperator.values[0]);

          vm.savedTriggers.push(vm.currentTrigger);
          vm.rule.stateDescriptors.push(stateDescriptorOne);
        }
      }

      _resetView();
      vm.ruleWizard.goToStep(1);
    }

    function listActions() {
      _resetView();

      vm.ruleWizard.goToStep(2);
    }

    function addAction(isExitAction) {
      if(isExitAction) {
        vm.exitAction = true;
      } else {
        vm.exitAction = false;
      }

      vm.show.addAction = true;
      vm.show.addTrigger = false;

      vm.actionWizard.goToStep(1);
    }

    function selectAction(actionDevice, actionType) {
      _setCurrentAction(actionDevice, actionType);

      vm.actionWizard.next();
    }

    function saveAction(actionDevice, actionType) {
      if(actionDevice && actionType) {
        _setCurrentAction(actionDevice, actionType);
      }
      var action = vm.currentAction.actionDevice.getAction(vm.currentAction.actionType);

      if(vm.exitAction) {
        vm.savedExitActions.push(vm.currentAction);
        vm.rule.exitActions.push(action);
      } else {
        vm.savedActions.push(vm.currentAction);
        vm.rule.actions.push(action);
      }

      _resetView();
      vm.ruleWizard.goToStep(2);
    }

    function saveRule() {
      // eventDescriptor or eventDescriptorList
      if(vm.rule.eventDescriptors.length > 1) {
        vm.rule.eventDescriptorList = vm.rule.eventDescriptors;
      } else if(vm.rule.eventDescriptors.length === 1) {
        vm.rule.eventDescriptor = vm.rule.eventDescriptors[0];
      }

      // stateEvaluator
      if(vm.rule.stateDescriptors.length > 0) {
        _getStateEvaluator();
      }

      // Actions
      if(vm.rule.actions.length === 0) {
        delete vm.rule.actions;
      }

      // ExitActions
      if(vm.rule.exitActions.length === 0 || vm.rule.eventDescriptors.length >= 1) {
        delete vm.rule.exitActions;
      }
      
      delete vm.rule.eventDescriptors;
      delete vm.rule.stateDescriptors;

      DSRule.create({
          'rule': vm.rule
        })
        .then(function(rule) {
          // TODO: Find a better way to update data-store after create (maybe use lifecycle hook "afterCreate")
          DSRule
            .findAll({}, {bypassCache:true})
            .then(function(rules) {
              $state.go('guh.rules.master');
            });
        })
        .catch(function(error) {
          $log.error(error);
        });
    }

    _init();

  }

}());