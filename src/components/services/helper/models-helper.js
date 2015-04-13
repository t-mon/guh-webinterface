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
    .module('guh.components.helper')
    .factory('ModelsHelper', ModelsHelper);

  ModelsHelper.$inject = ['$log'];

  function ModelsHelper($log) {

    var service = {
      getTemplateData: getTemplateData
    };

    return service;


    /*
     * Private method: _checkTemplateUrl(templateUrl)
     */
    function _checkTemplateUrl(templateUrl) {
      var basePathElements = templateUrl.split('/');
      basePathElements.pop();
      var basePath = basePathElements.join('/') + '/';

      if(templateUrl !== undefined && templateUrl !== '') {  
        var request = new XMLHttpRequest();

        request.open('HEAD', templateUrl, false);
        request.send();

        if(request.status === 200) {
          return templateUrl;
        } else {
          return basePath + 'default.html';
        }
      } else {
        return basePath + 'default.html';
      }
    }


    /*
     * Public method: getTemplateData(parameters)
     */
    function getTemplateData(parameters) {
      var basePath = 'components/directives/guh-types/templates/';

      var allowedValues = (parameters.allowedValues === undefined) ? [] : parameters.allowedValues;
      var defaultValue = (parameters.defaultValue === undefined) ? null : parameters.defaultValue;
      var inputType = (parameters.inputType === undefined) ? null : parameters.inputType;
      var maxValue = (parameters.maxValue === undefined) ? null : parameters.maxValue;
      var minValue = (parameters.minValue === undefined) ? null : parameters.minValue;
      var type = (parameters.type === undefined) ? null : parameters.type;
      var templateUrl = '';
      var value = null;

      switch(type) {
        case 'bool':
          value = false;
          templateUrl = basePath + 'input-checkbox.html';
          break;
        case 'int':
          value = 0;
          templateUrl = basePath + 'input-number.html';
          break;
        case 'uint': // positive integers
          value = 0;
          templateUrl = basePath + 'input-number.html';
          break;
        case 'double':
          value = 0.0;
          templateUrl = basePath + 'input-number-decimal.html';
          break;
        case 'QString':
          value = '';
          if(inputType) {
            if(inputType === 'InputTypeTextLine') {
              templateUrl = basePath + 'input-text.html';
            } else if(inputType === 'InputTypeTextArea') {
              templateUrl = basePath + 'input-textarea.html';
            } else if(inputType === 'InputTypePassword') {
              templateUrl = basePath + 'input-password.html';
            } else if(inputType === 'InputTypeSearch') {
              templateUrl = basePath + 'input-search.html';
            } else if(inputType === 'InputTypeMail') {
              templateUrl = basePath + 'input-mail.html';
            } else if(inputType === 'InputTypeIPv4Address') {
              templateUrl = basePath + 'input-ipv4.html';
            } else if(inputType === 'InputTypeIPv6Address') {
              templateUrl = basePath + 'input-ipv6.html';
            } else if(inputType === 'InputTypeUrl') {
              templateUrl = basePath + 'input-url.html';
            } else if(inputType === 'InputTypeMacAddress') {
              templateUrl = basePath + 'input-mac.html';
            }
          } else if(angular.isArray(allowedValues)) {
            templateUrl = basePath + 'input-select.html';
          } else {
            templateUrl = basePath + 'input-text.html';
          }
          break;
        case 'QColor':
          // value = 'rgba(255, 255, 255, 1)';
          value = 0;
          templateUrl = basePath + 'input-color.html';
          break;
      }

      return {
        templateUrl: _checkTemplateUrl(templateUrl),
        value: value
      };
    }

  }

}());