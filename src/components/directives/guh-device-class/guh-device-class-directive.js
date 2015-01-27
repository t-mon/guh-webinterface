/* Copyright (C) 2015 guh
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 *
 */

(function(){
  "use strict";

  angular
    .module('guh.components.ui')
    .directive('guhDeviceClass', deviceClassDirective);

  deviceClassDirective.$inject = ['$log', '$http', '$compile'];

  function deviceClassDirective($log, $http, $compile) {
    var directive = {
      link: deviceClassLink,
      restrict: 'E',
      scope: {
        deviceClass: '=model',
        executeAction: '&',
        show: '=',
        saveAction: '&',
        saveEventDescriptor: '&',
        saveStateDescriptor: '&',
        saveParamDescriptor: '&'
      }
    };

    return directive;


    /* jshint unused: vars */
    function deviceClassLink(scope, element, attributes) {
      scope.$watch('deviceClass', function(newDeviceClass, oldDeviceClass) {
        // Check if scope-value is a DeviceClass and if IDs of new and old values are different
        // if(angular.isObject(newDeviceClass) && !angular.equals(newDeviceClass.id, oldDeviceClass.id)) {
        if(angular.isObject(newDeviceClass)) {
          // getOwnPropertyNames => ECMA 5 => >=IE9 (http://designpepper.com/blog/drips/retrieving-property-names-with-object-getownpropertynames-and-object-keys.html)
          if(Object.getOwnPropertyNames(newDeviceClass).length !== 0 && angular.isFunction(newDeviceClass.getTemplateUrl)) {
            var templateUrl = newDeviceClass.getTemplateUrl();

            // $http.get(scope.newDeviceClass.template).success(function(template) {
            $http.get(templateUrl).success(function(template) {
              // Replace guhDeviceClass-directive with proper guhForm
              var guhForm = angular.element(template);
              var compiled = $compile(guhForm)(scope);
              element.append(compiled);
              element = compiled;
            });
          }
        }
      });
    }
  }

}());