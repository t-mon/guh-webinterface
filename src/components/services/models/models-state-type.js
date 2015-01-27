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
    .factory('StateType', StateTypeFactory);

  StateTypeFactory.$inject = [];

  function StateTypeFactory() {

    /*
     * Constructor
     */
    function StateType(data) {
      this.defaultValue = data.defaultValue;
      this.id = data.id;
      this.name = data.name;
      this.type = data.type;
    }

    /*
     * Static methods
     */
    angular.extend(StateType, {
    });

    /*
     * Public prototype methods
     */
    angular.extend(StateType.prototype, {
      getInputTemplate: getInputTemplate
    });

    return StateType;


    /*
     * Private method: _checkTemplateUrl(templateUrl)
     */
    function _checkTemplateUrl(templateUrl) {
      var basePath = 'components/directives/guh-types/templates/';

      if(templateUrl !== undefined && templateUrl !== '') {  
        var request = new XMLHttpRequest();

        request.open('HEAD', templateUrl, false);
        request.send();

        if(request.status === 200) {
          return templateUrl;
        } else {
          return basePath + 'input-default.html';
        }
      } else {
        return basePath + 'input-default.html';
      }
    }


    /*
     * Public method: getInputTemplate()
     */
    function getInputTemplate() {
      /* jshint validthis:true */
      // var defaultValue = this.defaultValue;
      var basePath = 'components/directives/guh-types/templates/';
      var name = this.name;
      var templateUrl = '';
      var type = this.type;

      switch(type) {
        case 'bool':
          this.value = false;
          templateUrl = basePath + 'input-checkbox.html';
          break;
        case 'int':
        case 'uint':
          this.value = 0;
          templateUrl = basePath + 'input-number.html';
          break;
        case 'double':
          this.value = 0.0;
          templateUrl = basePath + 'input-number-decimal.html';
          break;
        case 'QString':
          this.value = '';
          if(name === 'password') {
            templateUrl = basePath + 'input-password.html';
          } else if(name === 'recipient' || name === 'sender mail') {
            templateUrl = basePath + 'input-email.html';
          } else if(name === 'MAC') {
            templateUrl = basePath + 'input-mac-address.html';
          } else if(name === 'host address' || name === 'SMTP server') {
            templateUrl = basePath + 'input-server-address.html';
          } else if(name === 'ip') {
            templateUrl = basePath + 'input-ip-address.html';
          } else {
            templateUrl = basePath + 'input-text.html';
          }
          break;
        case 'QColor':
          // http://blog.templatemonster.com/2014/02/04/tutorial-build-a-color-picker-with-jquery-and-bootstrap/
          templateUrl = basePath + 'input-color.html';
          break;
        default:
          templateUrl = basePath + 'input-default.html';
          break;
      }

      return _checkTemplateUrl(templateUrl);
    }
  }

}());