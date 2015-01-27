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
    .controller('RulesDetailController', RulesDetailController);

  RulesDetailController.$inject = ['$log', '$stateParams', '$state', 'appConfig', 'Rule'];

  function RulesDetailController($log, $stateParams, $state, appConfig, Rule) {
    // Public Variables
    var vm = this;

    vm.actions = [];
    vm.enabled = false;
    vm.eventDescriptors = [];
    vm.id = '';
    vm.stateEvaluator = {};

    vm.remove = remove;
    // vm.executeAction = executeAction;
    

    /*
     * Private methods
     */
    function _init() {
      _getRule($stateParams.id)
        .then(success, failure);
      
      function success(rule) {
        $log.log(rule);
        vm.actions = rule.actions;
        vm.enabled = rule.enabled;
        vm.eventDescriptors = rule.eventDescriptors;
        vm.id = rule.id;
        vm.stateEvaluator = rule.stateEvaluator;
      }

      function failure(error) {
        $log.error(error);
      }
    }

    function _getRule(id) {
      return Rule.find(id);
    }

    
    /*
     * Public method: remove()
     */
    function remove() {
      Rule.remove(vm.id).then(function() {
        $state.go('guh.rules.master');
      });
    }

    _init();
  }
}());