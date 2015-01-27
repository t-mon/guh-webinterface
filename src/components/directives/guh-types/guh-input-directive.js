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
    .directive('guhInput', input);

  input.$inject = ['$log', '$http', '$compile'];

  function input($log, $http, $compile) {
    var directive = {
      link: inputLink,
      restrict: 'A',
      scope: {
        model: '=guhInput'
      }
    };

    return directive;


    /* jshint unused: vars */
    function inputLink(scope, element, attributes) {      
      scope.$on('$destroy', function() {
        // Remove only element, scope needed afterwards
        element.remove();
      });

      scope.$watch('model', function(newValue, oldValue) {
        var templateUrl = scope.model.getInputTemplate();

        $http.get(templateUrl).success(function(template) {
          // Replace guhInput-directive with proper HTML input
          element.html(template);
          $compile(element.contents())(scope);
        });
      });
    }
  }

}());