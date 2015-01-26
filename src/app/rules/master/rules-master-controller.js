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
    .controller('RulesMasterController', RulesMasterController);

  RulesMasterController.$inject = ['$log', 'Rule'];

  function RulesMasterController($log, Rule) {
    /*
     * Public variables
     */
    var vm = this;
    vm.configured = [];


    /*
     * Private methods
     */
    function _init() {
      Rule.findAll().then(function(rules) {
        vm.configured = rules;
      }, function(error) {
        $log.log(error);
      });
    }

    _init();

  }

}());