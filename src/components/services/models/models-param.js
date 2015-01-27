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
    .factory('Param', ParamFactory);

  ParamFactory.$inject = ['$log', 'ParamType', 'ParamDescriptor'];

  function ParamFactory($log, ParamType, ParamDescriptor) {

    /*
     * Constructor
     */
    function Param(data) {
      // Set param data
      this.data = {
        name: data.name,
        value: data.value
      };

      // Set paramType data
      this.type = new ParamType({
        name: data.name,
        allowedValues: data.allowedValues,
        defaultValue: data.defaultValue,
        maxValue: data.maxValue,
        minValue: data.minValue,
        type: data.type
      });

      // Set paramDescriptor data
      this.descriptor = new ParamDescriptor({
        name: data.name,
        operator: '',
        value: data.value
      });
    }

    /*
     * Static methods
     */
    angular.extend(Param, {
    });

    /*
     * Public prototype methods
     */
    angular.extend(Param.prototype, {
      getData: getData,
      getDescriptor: getDescriptor,
      getType: getType
    });

    return Param;


    /*
     * Public prototype method: getData
     */
    function getData() {
      /* jshint validthis:true */
      var self = this;

      return self.data;
    }

    /*
     * Public prototype method: getDescriptor
     */
    function getDescriptor() {
      /* jshint validthis:true */
      var self = this;

      return {
        name: self.name,
        operator: self.descriptor.operator,
        value: self.value
      };
    }

    /*
     * Public prototype method: getDescriptor
     */
    function getType() {
      /* jshint validthis:true */
      var self = this;

      return self.type;
    }

    
  }

}());