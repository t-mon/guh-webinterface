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
    .module('guh.components.models')
    .factory('Rule', RuleFactory);

  RuleFactory.$inject = ['$log', 'rulesService'];

  function RuleFactory($log, rulesService) {

    /*
     * Constructor
     */
    function Rule(data) {
      $log.log('rule data', data);

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
      $log.log('add rule', eventDescriptors, stateEvaluator, actions);

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