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