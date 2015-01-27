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
    .factory('ParamDescriptor', ParamDescriptorFactory);

  ParamDescriptorFactory.$inject = [];

  function ParamDescriptorFactory() {

    /*
     * Constructor
     */
    function ParamDescriptor(data) {
      this.name = data.name;
      this.value = data.value;
      this.operator = data.operator;
    }

    /*
     * Public prototype methods
     */
    angular.extend(ParamDescriptor.prototype, {
      setOperator: setOperator
    });

    return ParamDescriptor;
   

    /*
     * Public prototype method: setOperator
     */
    function setOperator(operator) {
      /* jshint validthis:true */
      var self = this;

      self.operator = operator;
    }

  }

}());