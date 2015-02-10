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