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
    .factory('Vendor', VendorFactory);

  VendorFactory.$inject = ['$log', 'deviceClassesService', 'vendorsService', 'DeviceClass'];

  function VendorFactory($log, deviceClassesService, vendorsService, DeviceClass) {

    /*
     * Constructor
     */
    function Vendor(data) {
      this.id = data.id;
      this.name = data.name;
      this.svgClass = data
        .name
        .toLowerCase()
        .replace(/\s/g, '-')
        .replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '');
    }

    /*
     * Static methods
     */
    angular.extend(Vendor, {
      find: find,
      findAll: findAll,
      findDeviceClasses: findDeviceClasses
    });

    return Vendor;


    /*
     * Static method: find(id)
     */
    function find(id) {
      return vendorsService
        .fetch(id)
        .then(function(vendorData) {
          return new Vendor(vendorData);
        });
    }

    /*
     * Static method: findAll()
     */
    function findAll() {
      return vendorsService
        .fetchAll()
        .then(function(vendorsData) {
          angular.forEach(vendorsData, function(vendorData, index) {
            vendorsData[index] = new Vendor(vendorData);
          });
          return vendorsData.filter(Boolean);
        });
    }

    /*
     * Static method: findDeviceClasses()
     */
    function findDeviceClasses(vendor) {
      return vendorsService
        .fetchDeviceClasses(vendor)
        .then(function(deviceClassesData) {
          angular.forEach(deviceClassesData, function(deviceClassData, index) {
            deviceClassesData[index] = new DeviceClass(deviceClassData);
          });
          return deviceClassesData;
        });
    }
  
  }

}());