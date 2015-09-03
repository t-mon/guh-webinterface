/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                     *
 * Copyright (C) 2015 Lukas Mayerhofer <lukas.mayerhofer@guh.guru>                     *
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
 
(function() {
  'use strict';

  angular
    .module('guh.ui')
    .directive('guhForm', guhForm);

    guhForm.$inject = ['$log', 'libs', 'app'];

    function guhForm($log, libs, app) {
      var directive = {
        bindToController: {
          name: '@',
          submitCallback: '&onFormSubmit',
        },
        controller: formCtrl,
        controllerAs: 'form',
        link: formLink,
        restrict: 'E',
        scope: {},
        templateUrl: 'app/shared/ui/form/form.html',
        transclude: true
      };

      return directive;


      function formCtrl($scope) {
        
        /*
         * Variables
         */

        /* jshint validthis: true */
        var vm = this;
        vm.formFields = [];


        /*
         * API
         */

        vm.addFormField = addFormField;
        vm.removeFormField = removeFormField;
        vm.updateFormField = updateFormField;
        vm.submit = submit;


        /*
         * Private methods
         */



        /*
         * Public methods
         */

        function addFormField(formFieldScope) {
          vm.formFields.push(formFieldScope);
        }

        function removeFormField(formFieldScope) {
          vm.formFields = vm.formFields.filter(function(formField) {
            return formField.$id === formFieldScope.$id;
          });
        }

        function updateFormField(formFieldScopeId, selectedOperator) {
          if(angular.isDefined(formFieldScopeId) && angular.isDefined(selectedOperator)) {
            var index = libs._.findIndex(vm.formFields, { '$id': formFieldScopeId });

            if(index !== -1) {
              vm.formFields[index].selectedOperator = selectedOperator;
            }
          }
        }

        function submit() {
          // Check if form is valid
          if($scope[vm.name].$valid) {
            var paramDescriptors = [];
            var params = [];

            angular.forEach(vm.formFields, function(scope) {
              if(angular.isDefined(scope.formField.selectedValueOperator)) {
                if(angular.toJson(scope.formField.selectedValueOperator) === angular.toJson(app.valueOperator.between)) {
                  // Between
                  paramDescriptors.push({
                    name: scope.formField.from.name,
                    operator: scope.formField.selectedOperator,
                    value: scope.formField.from.value,
                  });

                  paramDescriptors.push({
                    name: scope.formField.to.name,
                    operator: scope.formField.selectedOperator,
                    value: scope.formField.to.value,
                  });
                } else {
                  // Is, is not, greater than, less than
                  paramDescriptors.push({
                    name: scope.formField.name,
                    operator: scope.formField.selectedOperator,
                    value: scope.formField.value,
                  });
                }
              }

              params.push({
                name: scope.formField.name,
                value: scope.formField.value
              });
            });

            // TODO: Validation
            vm.submitCallback({
              paramDescriptors: paramDescriptors,
              params: params
            });
          } else {
            $log.log('Form not valid.');
          }
        }
        
      }


      function formLink(scope, element, attrs) {
        /* jshint unused: false */
      }
    }

}());