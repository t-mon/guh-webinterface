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

  AddTriggerCtrl.$inject = ['$log', '$rootScope', '$stateParams', 'DSRule', 'DSDevice', 'DSEventType', 'DSStateType', 'libs', 'app'];

  function AddTriggerCtrl($log, $rootScope, $stateParams, DSRule, DSDevice, DSEventType, DSStateType, libs, app) {

    // View data
    var vm = this;

    // View variables
    vm.rule = {};
    vm.selectedEventTypes = {};
    vm.selectedStateTypes = {};
    vm.availableOperators = {};

    // View methods
    vm.selectTrigger = selectTrigger;
    vm.selectDetails = selectDetails;


    function _init() {
      // Set rule data
      var rule = _getRule($stateParams.moodId);
      vm.rule = _cleanRule(rule);

      // Set devices with actions
      _setTriggerDevices();
    }

    function _getRule(ruleId) {
      return DSRule.get(ruleId);
    }

    function _cleanRule(rule) {
      var cleanedRule = angular.copy(rule);

      // rule.actions
      if(angular.isDefined(cleanedRule.actions)) {
        cleanedRule.actions = cleanedRule.actions.map(function(action) {
          delete action.phrase;
          return action;
        });
      }

      // rule.exitActions
      if(angular.isDefined(cleanedRule.exitActions)) {
        cleanedRule.exitActions = cleanedRule.exitActions.map(function(action) {
          delete action.phrase;
          return action;
        });
      }

      // rule.eventDescriptors
      if(cleanedRule.eventDescriptors.length > 1) {
        cleanedRule.eventDescriptorList = angular.copy(cleanedRule.eventDescriptors);
      } else if(cleanedRule.eventDescriptors.length === 1) {
        cleanedRule.eventDescriptor = angular.copy(cleanedRule.eventDescriptors[0]);
      }
      delete cleanedRule.eventDescriptors;

      // rule.stateEvaluator
      delete cleanedRule.stateEvaluator.stateDescriptor.phrase;
      if(angular.isDefined(cleanedRule.stateEvaluator.childEvaluators)) {
        cleanedRule.stateEvaluator.childEvaluators = cleanedRule.stateEvaluator.childEvaluators.map(function(childEvaluator) {
          delete childEvaluator.stateDescriptor.phrase;
          return childEvaluator;
        });
      }

      return cleanedRule;
    }

    function _setTriggerDevices() {
      var devices = DSDevice.getAll();
      var triggerDevices = devices.filter(_hasTrigger);

      vm.triggerDevices = angular.copy(triggerDevices);
    }

    function _hasTrigger(device) {
      return angular.isDefined(device.deviceClass) && (device.deviceClass.eventTypes.length > 0 || device.deviceClass.stateTypes.length > 0) && device.name.indexOf('mood-toggle') === -1;
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
        $log.log('is state!');
        if(angular.isDefined(vm.rule.stateEvaluator)) {
          $log.log('stateEvaluator defined');
          isSelected = (vm.rule.stateEvaluator.stateDescriptor && vm.rule.stateEvaluator.stateDescriptor.stateTypeId === eventStateType.id) ? true : false;

          if(!isSelected && angular.isDefined(vm.rule.stateEvaluator.childEvaluators)) {
            $log.log('childEvaluators defined');
            isSelected = libs._.some(vm.rule.stateEvaluator.childEvaluators, 'stateDescriptor.stateTypeId', eventStateType.id);
          }
        }
      }

      $log.log('isSelected', isSelected);

      return isSelected;
    }

    function _addEventDescriptor(eventDescriptor) {
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

    function _addStateEvaluator(stateDescriptor) {
      var stateEvaluator = {
        operator: app.stateOperator.StateOperatorAnd,
        stateDescriptor: stateDescriptor
      };

      if(angular.isDefined(vm.rule.stateEvaluator)) {
        if(angular.isUndefined(vm.rule.stateEvaluator.childEvaluators)) {
          vm.rule.stateEvaluator.childEvaluators = [];
        }

        vm.rule.stateEvaluator.childEvaluators.push(stateEvaluator);
      } else {
        vm.rule.stateEvaluator = stateEvaluator;
      }
    }

    function _removeStateEvaluator(device, stateType) {
      $log.log('_removeStateEvaluator');
      $log.log('device', device);
      $log.log('stateType', stateType);

      var removedStateDescriptor = {};

      if(angular.isDefined(vm.rule.stateEvaluator)) {
        // TODO: Remove vm.rule.stateEvaluator.stateDescriptor AND replace it with first childEvaluator
        // if(delete vm.rule.stateEvaluator.stateDescriptor) {
        //   var removedStateDescriptor = vm.rule.stateEvaluator.stateDescriptor;
        // }

        if(angular.isDefined(vm.rule.stateEvaluator.childEvaluators)) {
          removedStateDescriptor = libs._.remove(vm.rule.stateEvaluator.childEvaluators, function(childEvaluator) {
            return (childEvaluator.stateDescriptor.deviceId === device.id && childEvaluator.stateDescriptor.stateTypeId === stateType.id);
          });
        }
      }

      return removedStateDescriptor;
    }

    function _markAsSelected(device, eventStateType) {
      var isMarked = false;
      $log.log('_markAsSelected');

      if(DSEventType.is(eventStateType)) {
        var eventType = eventStateType;

        if(vm.selectedEventTypes[device.id] && vm.selectedEventTypes[device.id][eventType.id]) {
          // If already added => remove trigger
          _removeEventDescriptor(device, eventType);
          isMarked = _isSelected(eventType);
          vm.selectedEventTypes[device.id][eventType.id] = isMarked;
        } else {
          // Add "selected" class
          if(angular.isUndefined(vm.selectedEventTypes[device.id])) {
            $log.log('add selected class');
            vm.selectedEventTypes[device.id] = {};
          }
          $log.log('vm.selectedEventTypes', vm.selectedEventTypes);
          isMarked = _isSelected(eventType);
          vm.selectedEventTypes[device.id][eventType.id] = isMarked;
        }
      } else if(DSStateType.is(eventStateType)) {
        var stateType = eventStateType;

        $log.log('vm.selectedStateTypes', vm.selectedStateTypes);
        $log.log('device.id', device.id);
        $log.log('stateType.id', stateType.id);

        if(vm.selectedStateTypes[device.id] && vm.selectedStateTypes[device.id][stateType.id]) {
          // If already added => remove trigger
          $log.log('REMOVE');
          _removeStateEvaluator(device, stateType);
          isMarked = _isSelected(stateType);
          vm.selectedStateTypes[device.id][stateType.id] = isMarked;
        } else {
          // Add "selected" class
          if(angular.isUndefined(vm.selectedStateTypes[device.id])) {
            $log.log('add selected class');
            vm.selectedStateTypes[device.id] = {};
          }
          $log.log('vm.selectedStateTypes', vm.selectedStateTypes);
          isMarked = _isSelected(stateType);
          vm.selectedStateTypes[device.id][stateType.id] = isMarked;
        }
      }

      return isMarked;
    }

    function selectTrigger(device, eventStateType) {
      if(DSEventType.is(eventStateType)) {
        var eventType = eventStateType;

        if(eventType.paramTypes.length === 0) {
          // If not added previously => add eventDescriptor
          var eventDescriptor = device.getEventDescriptor(eventType);
          _addEventDescriptor(eventDescriptor);
          _markAsSelected(device, eventType);
        } else if(eventType.paramTypes.length > 0) {
          vm.selectedTriggerDevice = device;
          vm.selectedTriggerType = eventType;

          // angular.forEach(eventType.paramTypes, function(paramType) {
          //   paramType.availableOperators = _getAvailableOperators(paramType.type);
          // });

          // $log.log(vm.availableOperators);
          $log.log('vm.selectedTriggerType', vm.selectedTriggerType);
          if(!_isSelected(eventType)) {
            $rootScope.$broadcast('wizard.next', 'addTriggerDetails');
          } else {
            _markAsSelected(device, eventType); 
          }
        }
      } else if(DSStateType.is(eventStateType)) {
        var stateType = eventStateType;

        vm.selectedTriggerDevice = device;
        vm.selectedTriggerType = stateType;

        $log.log('vm.selectedTriggerType', vm.selectedTriggerType);
        if(!_isSelected(stateType)) {
          $rootScope.$broadcast('wizard.next', 'addTriggerDetails');
        } else {
          _markAsSelected(device, stateType); 
        }

        $log.log('vm.selectedStateTypes', vm.selectedStateTypes);
      }

      $log.log('vm.rule', vm.rule);
    }

    function selectDetails(params) {
      if(DSEventType.is(vm.selectedTriggerType)) {
        var eventDescriptor = {};
        var paramDescriptors = [];

        paramDescriptors = vm.selectedTriggerType.paramTypes.map(function(paramType, index) {
          var param = params[index];
          return vm.selectedTriggerType.getParamDescriptor(paramType, param.value, 'ValueOperatorEquals');
        });
        eventDescriptor = vm.selectedTriggerDevice.getEventDescriptor(vm.selectedTriggerType, paramDescriptors);
        
        // if(angular.isDefined(vm.rule.eventDescriptorList)) {
          // vm.rule.eventDescriptorList[vm.rule.eventDescriptorList.length - 1] = eventDescriptor;
        // } else if(angular.isDefined(vm.rule.eventDescriptor)) {
        //   vm.rule.eventDescriptor = eventDescriptor;
        // }

        // var isMarked = _markAsSelected(vm.selectedTriggerDevice, vm.selectedTriggerType);
        // if(!isMarked) {
          _addEventDescriptor(eventDescriptor);
          _markAsSelected(vm.selectedTriggerDevice, vm.selectedTriggerType);
        // }
      } else if(DSStateType.is(vm.selectedTriggerType)) {
        var stateDescriptor = {};
        stateDescriptor = vm.selectedTriggerDevice.getStateDescriptor(vm.selectedTriggerType, params[0].value, 'ValueOperatorEquals');

        // var isMarked = _markAsSelected(vm.selectedTriggerDevice, vm.selectedTriggerType);
        // if(!isMarked) {
          _addStateEvaluator(stateDescriptor);
          _markAsSelected(vm.selectedTriggerDevice, vm.selectedTriggerType);
        // }
      }

      $log.log('vm.rule', vm.rule);

      $rootScope.$broadcast('wizard.prev', 'addTriggerDetails');
    }


    _init();

  }

}());