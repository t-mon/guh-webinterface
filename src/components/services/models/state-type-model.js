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
    .factory('DSStateType', DSStateTypeFactory)
    .run(function(DSStateType) {});

  DSStateTypeFactory.$inject = ['$log', 'DS', 'ModelsHelper'];

  function DSStateTypeFactory($log, DS, ModelsHelper) {

    var staticMethods = {};


    /*
     * DataStore configuration
     */
    var DSStateType = DS.defineResource({

      // API configuration
      endpoint: 'state_types',
      suffix: '.json',

      // Model configuration
      idAttribute: 'id',
      name: 'stateType',
      relations: {
        belongsTo: {
          deviceClass: {
            localField: 'deviceClass',
            localKey: 'deviceClassId',
            parent: true
          }
        }
      },

      // Model data and instance methods
      computed: {
        inputData: ['defaultValue', 'id', 'name', 'type', _getInputData]
      },
      methods: {
        // resetInput: resetInput
      }

    });

    return DSStateType;


    /*
     * Private method: _getTriggerPhrase(name)
     */
    function _getTriggerPhrase(name) {
      // Get value inside Brackets []
      var regExp = /\s\[([^)]+)\]/;
      var searchUnit = name.replace(regExp, '');
      var phrase = name;

      // If name contains the unit in brackets []
      if(regExp.test(name)) {
        phrase = searchUnit;
      }

      return 'When value of ' + phrase + ' is...';
    }

    /*
     * Private method: _getInputData(defaultValue, id, name, type)
     */
    function _getInputData(defaultValue, id, name, type) {
      var templateParams = {
        defaultValue: defaultValue,
        name: name,
        type: type
      };
      var templateData = ModelsHelper.getTemplateData(templateParams);
      var inputData = {};

      inputData.stateTypeId = id;
      inputData.templateUrl = templateData.templateUrl;
      inputData.triggerPhrase = _getTriggerPhrase(name);
      inputData.unit = ModelsHelper.getUnit(name);
      inputData.value = templateData.value;

      return inputData;
    }

    // /*
    //  * Instance method: resetInput()
    //  */
    // function resetInput() {
    //   this.input = _getInputData(this.defaultValue, this.id, this.name, this.type);
    // }

  }

}());