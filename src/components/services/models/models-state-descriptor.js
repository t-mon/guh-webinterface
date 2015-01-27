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
    .factory('StateDescriptor', StateDescriptorFactory);

  StateDescriptorFactory.$inject = [];

  function StateDescriptorFactory() {

    /*
     * Constructor
     * deviceId, eventTypeData
     */
    function StateDescriptor(data) {
      this.deviceId = data.deviceId;
      this.operator = data.operator;
      this.stateTypeId = data.stateTypeId;
      this.value = data.value;
    }

    return StateDescriptor;

  }

}());