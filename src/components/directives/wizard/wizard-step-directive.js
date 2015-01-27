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
    .directive('guhWizardStep', wizardStep);

  wizardStep.$inject = [];

  function wizardStep() {

    var directive = {
      link: wizardStepLink,
      replace: true,
      require: '^guhWizard',
      restrict: 'E',
      scope: {
        title: '@',
      },
      templateUrl: 'components/directives/wizard/wizard-step.html',
      transclude: true
    };

    function wizardStepLink(scope, element, attributes, wizardControl) {
      // Add step to wizard
      wizardControl.internal.addStep(scope);
    }

    return directive;

  }

}());