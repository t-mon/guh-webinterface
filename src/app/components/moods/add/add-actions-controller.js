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
    .controller('AddActionsCtrl', AddActionsCtrl);

  AddActionsCtrl.$inject = ['$log', '$scope', '$rootScope', 'DSDevice'];

  function AddActionsCtrl($log, $scope, $rootScope, DSDevice) {

    var vm = this;
    var isExitAction = false;

    // Public varaibles
    vm.rule = {};
    vm.enterActionDevices = [];
    vm.exitActionDevices = [];
    vm.selectedActionType = {};

    // Public methods
    vm.selectAction = selectAction;


    function _init() {
      $log.log('_init', $scope);

      _findAllDevices()
        .then(function(devices) {
          angular.forEach(devices, function(device) {
            if(angular.isDefined(device.deviceClass) && device.deviceClass.actionTypes.length > 0) {
              vm.enterActionDevices.push(device);
              vm.exitActionDevices.push(device);
            }
          });
        });
    }

    function _findAllDevices(bypassCache) {
      if(bypassCache) {
        return DSDevice.findAll();
      }

      return DSDevice.findAll();
    }

    function selectAction(device, actionType) {
      vm.selectedActionType = actionType;

      var ruleAction = {
        actionTypeId: actionType.id,
        deviceId: device.id
      };

      if(isExitAction) {
        if(angular.isUnDefined(vm.currentRule.exitActions)) {
          vm.currentRule.exitActions = [];
        }

        vm.currentRule.exitActions.push(ruleAction);
      } {
        vm.currentRule.actions.push(ruleAction);
      }

      $log.log('vm.currentRule', vm.currentRule);

      if(actionType.paramTypes.length > 0) {
        $rootScope.$broadcast('wizard.next', 'addActions');
      }
    }


    _init(false);

  }

}());
