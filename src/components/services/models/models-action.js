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
    .factory('Action', ActionFactory);

  ActionFactory.$inject = ['$log', 'devicesService', 'Param', 'ActionType'];

  function ActionFactory($log, devicesService, Param, ActionType) {

    /*
     * Constructor
     */
    function Action(data) {
      // Create params & paramTypes
      data.params = [];
      angular.forEach(data.paramTypes, function(paramTypeData, index) {
        var param = new Param(paramTypeData);
        // data.params[index] = param.getData(); => PROBLEM: guhInput gets ParamTyep => changed input value only reflected in ParamType but bot in Param
        data.paramTypes[index] = param.getType();
      });

      // Set aciton data
      this.actionTypeId = data.id;
      this.deviceId = '';
      this.params = data.params;

      // Set actionType data
      this.type = new ActionType({
        id: data.id,
        name: data.name,
        paramTypes: data.paramTypes
      });
    }

    /*
     * Public prototype methods
     */
    angular.extend(Action.prototype, {
      execute: execute,
      getData: getData,
      getType: getType,
      getInputTemplate: getInputTemplate,
      setDeviceId: setDeviceId
    });

    return Action;


    /*
     * Public method: execute()
     */
    function execute() {
      /* jshint validthis:true */
      var self = this;
      var params = [];

      angular.forEach(self.type.paramTypes, function(paramTypeData, index) {
        var param = new Param(paramTypeData);
        params[index] = param.getData();
      });

      return devicesService.executeAction({
        deviceId: self.deviceId,
        actionTypeId: self.actionTypeId,
        name: self.name,
        params: params
        // params: angular.copy(self.params)
      });
    }

    /*
     * Public method: getData()
     */
    function getData() {
      /* jshint validthis:true */
      var self = this;

      return {
        actionTypeId: self.actionTypeId,
        deviceId: self.deviceId,
        params: self.params
      };
    }

    /*
     * Public method: getActionType()
     */
    function getType() {
      /* jshint validthis:true */
      var self = this;

      return self.type;
    }

    /*
     * Public method: getInputTemplate()
     */
    function getInputTemplate() {
      /* jshint validthis:true */
      var basePath = 'components/directives/guh-types/templates/';
      var name = this.name;
      var params = this.params;

      // TODO: Return proper input template
      return basePath + 'button.html';
    }

    /*
     * Public method: setDeviceId()
     */
    function setDeviceId(id) {
      /* jshint validthis:true */
      this.deviceId = id;
    }

  }

}());