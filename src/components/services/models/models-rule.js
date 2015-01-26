/* Copyright (C) 2015 guh
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 *
 */

(function(){
  "use strict";

  angular
    .module('guh.components.models')
    .factory('Rule', RuleFactory);

  RuleFactory.$inject = ['$log', 'rulesService'];

  function RuleFactory($log, rulesService) {

    /*
     * Constructor
     */
    function Rule(data) {
      this.actions = data.actions;
      this.enabled = data.enabled;
      this.eventDescriptors = data.eventDescriptors;
      this.id = data.id;
      this.stateEvaluator = data.stateEvaluator;
    }

    /*
     * Static methods
     */
    angular.extend(Rule, {
      add: add,
      find: find,
      findAll: findAll,
      remove: remove
    });

    return Rule;


    /*
     * Static method: find(id)
     */
    function add(eventDescriptors, stateEvaluator, actions) {
      return rulesService.add(eventDescriptors, stateEvaluator, actions);
    }

    /*
     * Static method: find(id)
     */
    function find(id) {
      return rulesService
        .fetch(id)
        .then(function(ruleData) {
          return new Rule(ruleData);
          // return ruleData;
        });
    }

    /*
     * Static method: findAll()
     */
    function findAll() {
      return rulesService
        .fetchAll()
        .then(function(rulesData) {
          angular.forEach(rulesData, function(ruleData, index) {
            // rulesData[index] = new Rule(ruleData);
            rulesData[index] = ruleData;
          });
          return rulesData.filter(Boolean);
        });
    }

    /*
     * Static method: remove()
     */
    function remove(ruleId) {
      return rulesService.remove(ruleId);
    }   

  }

}());