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
    .factory('Event', EventFactory);

  EventFactory.$inject = ['$log', '$http', 'Param', 'EventType', 'EventDescriptor'];

  function EventFactory($log, $http, Param, EventType, EventDescriptor) {

    /*
     * Constructor
     */
    function Event(data) {
      // Create params & paramTypes
      data.params = [];
      angular.forEach(data.paramTypes, function(paramTypeData, index) {
        var param = new Param(paramTypeData);
        data.params[index] = param;
        data.paramTypes[index] = param.getType();
      });

      // Set event data
      this.deviceId = '';
      this.eventTypeId = data.id;
      this.params = data.params;

      // Set eventType data
      this.type = new EventType({
        id: data.id,
        name: data.name,
        paramTypes: data.paramTypes
      });

      // Set eventDescriptor data
      this.descriptor = new EventDescriptor({
        deviceId: '',
        eventTypeId: data.id,
        paramTypes: data.paramTypes
      });
    }

    /*
     * Static methods
     */
    angular.extend(Event, {
    });

    /*
     * Public prototype methods
     */
    angular.extend(Event.prototype, {
      getDescriptor: getDescriptor,
      getInputTemplate : getInputTemplate,
      getType: getType,
      setDeviceId: setDeviceId
    });

    return Event;


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
        eventTypeId: self.eventTypeId,
        paramDescriptors: paramDescriptors
      };
    }

    /*
     * Public prototype method: getInputTemplate()
     */
    function getInputTemplate() {
      var basePath = 'components/directives/guh-types/templates/';

      return basePath + 'event-default.html';
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
      self.deviceId = id;
    }

  }

}());