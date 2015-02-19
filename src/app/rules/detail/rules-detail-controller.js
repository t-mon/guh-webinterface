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

    // Public Methods
    vm.remove = remove;
    // vm.executeAction = executeAction;
    

    /*
     * Private methods
     */
    function _init() {
      $log.log('init', $stateParams);

      _getRule($stateParams.id)
        .then(success, failure);
      
      function success(rule) {
        $log.log('rule', rule);

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