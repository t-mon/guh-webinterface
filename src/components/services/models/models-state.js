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
    .factory('State', StateFactory);

  StateFactory.$inject = ['$log', '$http', 'Param', 'StateType', 'StateDescriptor'];

  function StateFactory($log, $http, Param, StateType, StateDescriptor) {

    /*
     * Constructor
     */
    function State(data) {
      // Create params & paramTypes
      data.params = [];
      angular.forEach(data.paramTypes, function(paramTypeData, index) {
        var param = new Param(paramTypeData);
        data.params[index] = param;
        data.paramTypes[index] = param.getType();
      });

      // Set state data
      this.data = {
        deviceId: '',
        stateTypeId: data.id,
        value: data.value
      };

      // Set stateType data
      this.type = new StateType({
        defaultValue: data.defaultValue,
        id: data.id,
        name: data.name,
        type: data.type
      });

      // Set stateDescriptor data
      this.descriptor = new StateDescriptor({
        deviceId: '',
        operator: data.operator,
        stateTypeId: data.id,
        value: data.value
      });
    }

    /*
     * Static methods
     */
    angular.extend(State, {
    });

    /*
     * Public prototype methods
     */
    angular.extend(State.prototype, {
      getDescriptor: getDescriptor,
      getType: getType,
      setDeviceId: setDeviceId
    });

    return State;


    /*
     * Public prototype method: getDescriptor()
     */
    function getDescriptor() {
      /* jshint validthis:true */
      var self = this;
      var paramDescriptors = [];

      angular.forEach(self.paramTypes, function(paramType) {
        paramDescriptors.push(paramType.getDescriptor());
      });

      return {
        deviceId: self.deviceId,
        eventTypeId: self.id,
        paramDescriptors: paramDescriptors
      };
    }

    /*
     * Public prototype method: getType()
     */
    function getType() {
      /* jshint validthis:true */
      var self = this;

      return self.type;
    }

    /*
     * Public prototype method: setDeviceId()
     */
    function setDeviceId(id) {
      /* jshint validthis:true */
      var self = this;

      self.type.deviceId = id;
      self.descriptor.deviceId = id;
    }

  }

}());