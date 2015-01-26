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
    .factory('ActionType', ActionTypeFactory);

  ActionTypeFactory.$inject = ['$log', '$http', 'ParamType'];

  function ActionTypeFactory($log, $http, ParamType) {

    /*
     * Constructor
     */
    function ActionType(data) {
      angular.forEach(data.paramTypes, function(paramTypeData, index) {
        data.paramTypes[index] = new ParamType(paramTypeData);
      });

      this.id = data.id;
      this.name = data.name;
      this.paramTypes = data.paramTypes;
    }


    /*
     * Public prototype methods
     */
    angular.extend(ActionType.prototype, {
      getInputTemplate: getInputTemplate
    });

    return ActionType;


    /*
     * Public method: getInputTemplate()
     */
    function getInputTemplate() {
      /* jshint validthis:true */
      var basePath = 'components/directives/guh-types/templates/';
      var paramTypes = this.paramTypes;

      if(angular.isArray(paramTypes) && paramTypes.length > 0) {
        return false;
      } else {
        return basePath + 'input-checkbox.html';
      }
    }

  }

}());