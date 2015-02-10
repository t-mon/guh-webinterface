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