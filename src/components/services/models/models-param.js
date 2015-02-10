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
    .factory('Param', ParamFactory);

  ParamFactory.$inject = ['$log', 'ParamType', 'ParamDescriptor'];

  function ParamFactory($log, ParamType, ParamDescriptor) {

    /*
     * Constructor
     */
    function Param(data) {
      // Set param data
      this.data = {
        name: data.name,
        value: data.value
      };

      // Set paramType data
      this.type = new ParamType({
        name: data.name,
        allowedValues: data.allowedValues,
        defaultValue: data.defaultValue,
        maxValue: data.maxValue,
        minValue: data.minValue,
        type: data.type
      });

      // Set paramDescriptor data
      this.descriptor = new ParamDescriptor({
        name: data.name,
        operator: '',
        value: data.value
      });
    }

    /*
     * Static methods
     */
    angular.extend(Param, {
    });

    /*
     * Public prototype methods
     */
    angular.extend(Param.prototype, {
      getData: getData,
      getDescriptor: getDescriptor,
      getType: getType
    });

    return Param;


    /*
     * Public prototype method: getData
     */
    function getData() {
      /* jshint validthis:true */
      var self = this;

      return self.data;
    }

    /*
     * Public prototype method: getDescriptor
     */
    function getDescriptor() {
      /* jshint validthis:true */
      var self = this;

      return {
        name: self.name,
        operator: self.descriptor.operator,
        value: self.value
      };
    }

    /*
     * Public prototype method: getDescriptor
     */
    function getType() {
      /* jshint validthis:true */
      var self = this;

      return self.type;
    }

    
  }

}());