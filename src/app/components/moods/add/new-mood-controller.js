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
 * @name guh.devices.controller:DevicesDetailCtrl
 *
 * @description
 * Load and show details of certain device.
 *
 */

(function(){
  'use strict';

  angular
    .module('guh.moods')
    .controller('NewMoodCtrl', NewMoodCtrl);

  NewMoodCtrl.$inject = ['$log', '$rootScope', 'DSDevice', 'libs'];

  function NewMoodCtrl($log, $rootScope, DSDevice, libs) {

    // View data
    var vm = this;
    vm.rule = {};
    vm.enterActionDevices = [];
    vm.exitActionDevices = [];
    vm.selectedEnterActionDevice = {};
    vm.selectedExitActionDevice = {};
    vm.selectedEnterActionType = {};
    vm.selectedExitActionType = {};

    vm.selectedEnterActionTypes = {};
    vm.selectedExitActionTypes = {};

    // View methods
    vm.selectEnterAction = selectEnterAction;
    vm.selectExitAction = selectExitAction;
    vm.addEnterActionParams = addEnterActionParams;
    vm.addExitActionParams = addExitActionParams;


    function _init() {
      // Prepare rule object
      vm.rule = {
        actions: [],
        enabled: false,
        name: ''
      };

      // Set devices with actions
      _setActionDevices();
    }

    function _setActionDevices() {
      // TODO: Replace this with initialData from app-routes.js (new dialog/modal service needed)
      var devices = DSDevice.getAll();
      var actionDevices = devices.filter(_hasActions);

      vm.enterActionDevices = actionDevices.map(function(actionDevice) {
        var actionDeviceDeepCopy = angular.copy(actionDevice);

        actionDeviceDeepCopy.deviceClass.actionTypes = actionDeviceDeepCopy.deviceClass.actionTypes.map(function(actionType) {
          var actionTypeDeepCopy = angular.copy(actionType);

          return actionTypeDeepCopy;
        });

        return actionDeviceDeepCopy;
      });
      // $log.log('vm.enterActionDevices', vm.enterActionDevices);

      vm.exitActionDevices = actionDevices.map(function(actionDevice) {
        var actionDeviceDeepCopy = angular.copy(actionDevice);

        actionDeviceDeepCopy.deviceClass.actionTypes = actionDeviceDeepCopy.deviceClass.actionTypes.map(function(actionType) {
          var actionTypeDeepCopy = angular.copy(actionType);

          return actionTypeDeepCopy;
        });

        return actionDeviceDeepCopy;
      });
      // $log.log('vm.exitActionDevices', vm.exitActionDevices);
    }

    function _hasActions(device) {
      return angular.isDefined(device.deviceClass) && device.deviceClass.actionTypes.length > 0 && device.name.indexOf('mood-toggle') === -1;
    }

    function _getRuleActionData(device, actionType, ruleActionParams) {
      var ruleAction = {};

      if(angular.isDefined(device) && angular.isDefined(actionType)) {
        ruleAction.actionTypeId = actionType.id;
        ruleAction.deviceId = device.id;

        if(actionType.paramTypes.length > 0 && angular.isDefined(ruleActionParams)) {
          ruleAction.ruleActionParams = angular.copy(ruleActionParams);
        }
      }

      return ruleAction;
    }

    function _isSelected(enterExitAction, actionType) {
      var ruleActions = enterExitAction === 'enter' ? vm.rule.actions : vm.rule.exitActions;
      var isSelected = false;

      isSelected = libs._.some(ruleActions, 'actionTypeId', actionType.id);

      return isSelected;
    }

    function _removeRuleAction(enterExitAction, actionType) {
      var ruleActions = enterExitAction === 'enter' ? vm.rule.actions : vm.rule.exitActions;
      
      var removedRuleAction = libs._.remove(ruleActions, function(ruleAction) {
        return ruleAction.actionTypeId === actionType.id;
      });

      return removedRuleAction;
    }

    function selectEnterAction(device, actionType) {
      // if(actionType.selected) {
      if(vm.selectedEnterActionTypes[actionType.id]) {
        // Remove ruleAction
        _removeRuleAction('enter', actionType);
        // actionType.selected = _isSelected('enter', actionType);
        vm.selectedEnterActionTypes[actionType.id] = _isSelected('enter', actionType);
      } else {
        // Add ruleAction
        var ruleAction = _getRuleActionData(device, actionType);

        vm.rule.actions.push(ruleAction);

        if(actionType.paramTypes.length > 0) {
          vm.selectedEnterActionDevice = device;
          vm.selectedEnterActionType = actionType;
          $rootScope.$broadcast('wizard.next', 'addEnterActions');
        }

        // Add "selected" class
        // actionType.selected = _isSelected('enter', actionType);
        vm.selectedEnterActionTypes[actionType.id] = _isSelected('enter', actionType);
      }

      $log.log('vm.rule', vm.rule);
    }

    function selectExitAction(device, actionType) {
      // if(actionType.selected) {
      if(vm.selectedExitActionTypes[actionType.id]) {
        // Remove ruleAction
        _removeRuleAction('exit', actionType);
        // actionType.selected = _isSelected('exit', actionType);
        vm.selectedExitActionTypes[actionType.id] = _isSelected('exit', actionType);
      } else {
        // Add ruleAction
        var ruleAction = _getRuleActionData(device, actionType);

        if(angular.isUndefined(vm.rule.exitActions)) {
          vm.rule.exitActions = [];
        }

        vm.rule.exitActions.push(ruleAction);

        if(actionType.paramTypes.length > 0) {
          vm.selectedExitActionDevice = device;
          vm.selectedExitActionType = actionType;
          $rootScope.$broadcast('wizard.next', 'addExitActions');
        }

        // Add "selected" class
        // actionType.selected = _isSelected('exit', actionType);
        vm.selectedExitActionTypes[actionType.id] = _isSelected('exit', actionType);
      }

      $log.log('vm.rule', vm.rule);
    }

    function addEnterActionParams(params) {
      var ruleAction = _getRuleActionData(vm.selectedEnterActionDevice, vm.selectedEnterActionType, params);
      vm.rule.actions[vm.rule.actions.length - 1] = ruleAction;
      $rootScope.$broadcast('wizard.prev', 'addEnterActions');
    }

    function addExitActionParams(params) {
      var ruleAction = _getRuleActionData(vm.selectedExitActionDevice, vm.selectedExitActionType, params);
      vm.rule.exitActions[vm.rule.exitActions.length - 1] = ruleAction;
      $rootScope.$broadcast('wizard.prev', 'addExitActions');
    }


    _init();

  }

}());
