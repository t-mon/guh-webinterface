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
    .factory('EventType', EventTypeFactory);

  EventTypeFactory.$inject = ['$log', '$http', 'ParamType'];

  function EventTypeFactory($log, $http, ParamType) {

    /*
     * Constructor
     */
    function EventType(data) {
      angular.forEach(data.paramTypes, function(paramTypeData, index) {
        data.paramTypes[index] = new ParamType(paramTypeData);
      });

      this.id = data.id;
      this.name = data.name;
      this.paramTypes = data.paramTypes;
    }

    /*
     * Static methods
     */
    angular.extend(EventType, {
    });

    /*
     * Public prototype methods
     */
    angular.extend(EventType.prototype, {
      getInputTemplate : getInputTemplate
    });

    return EventType;


    /*
     * Public method: getInputTemplate()
     */
    function getInputTemplate() {
      var basePath = 'components/directives/guh-types/templates/';

      return basePath + 'event-default.html';
    }

  }

}());