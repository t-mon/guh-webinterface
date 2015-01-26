/* Copyright (C) 2015 guh
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 *
 */

(function(){
  "use strict";

  angular
    .module('guh.components.api')
    .factory('rulesService', rulesService);

  rulesService.$inject = ['$log', 'Restangular'];

  function rulesService($log, Restangular) {
    var service = {
      add: add,
      fetch: fetch,
      fetchAll: fetchAll,
      remove: remove
      // getRules           : getRules,
      // getRuleById        : getRuleById,
      // addRule            : addRule
    },
    api = Restangular.all('rules');

    return service;


    // Add a rule
    function add(eventDescriptors, stateEvaluator, actions) {
      return api.customPOST({
        'rule': {
          'eventDescriptorList': eventDescriptors,
          // 'stateEvaluator': stateEvaluator,
          'actions': actions
        }
      });
    }

    // Fetch device list (without actions or states)
    function fetchAll() {
      return api.getList();
    }

    // Fetch device (without actions or states)
    function fetch(id) {
      return api.get(id);
    }

    // Remove device
    function remove(ruleId) {
      return api.one(ruleId).remove();
    }

    // // Fetch rule list (without actions, eventDescriptors or stateEvaluator)
    // function getRules() {
    //   return rules.getList().then(success, failure);

    //   function success(rules) {
    //     return rules;
    //   }

    //   function failure(error) {
    //     return error;
    //   }
    // }

    // // Fetch certain rule (with actions, eventDescriptors and stateEvaluator)
    // function getRuleById(id) {
    //   return rules.get(id).then(success, failure);

    //   function success(rule) {
    //     return rule;
    //   }

    //   function failure(error) {
    //     return error;
    //   }
    // }

    // // Add new rule
    // function addRule(eventDescriptors, stateEvaluator, actions) {
    //   return rules.customPOST({
    //     'rule': {
    //       'eventDescriptorList': eventDescriptors,
    //       'stateEvaluator': stateEvaluator,
    //       'actions': actions
    //     }
    //   });
    // }

  }

}());