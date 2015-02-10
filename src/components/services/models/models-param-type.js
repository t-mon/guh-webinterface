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
    .factory('ParamType', ParamTypeFactory);

  ParamTypeFactory.$inject = [];

  function ParamTypeFactory() {

    /*
     * Constructor
     */
    function ParamType(data) {
      this.name = data.name;
      this.allowedValues = data.allowedValues;
      this.defaultValue = data.defaultValue;
      this.maxValue = data.maxValue;
      this.minValue = data.minValue;
      this.type = data.type;
    }

    /*
     * Public prototype methods
     */
    angular.extend(ParamType.prototype, {
      getInputTemplate: getInputTemplate
    });

    return ParamType;


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
     * Public prototype method: getInputTemplate()
     */
    function getInputTemplate() {
      /* jshint validthis:true */
      var allowedValues = this.allowedValues;
      var basePath = 'components/directives/guh-types/templates/';
      // var defaultValue = this.defaultValue;
      // var maxValue = this.maxValue;
      // var minValue = this.minValue;
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
          } else if(angular.isArray(allowedValues)) {
            templateUrl = basePath + 'input-select.html';
          } else {
            templateUrl = basePath + 'input-text.html';
          }
          break;
        case 'QColor':
          // http://blog.templatemonster.com/2014/02/04/tutorial-build-a-color-picker-with-jquery-and-bootstrap/
          templateUrl = basePath + 'input-color.html';
          break;
      }

      return _checkTemplateUrl(templateUrl);
    }

  }

}());