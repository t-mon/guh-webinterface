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
    .factory('Vendor', VendorFactory);

  VendorFactory.$inject = ['$log', 'deviceClassesService', 'vendorsService', 'DeviceClass'];

  function VendorFactory($log, deviceClassesService, vendorsService, DeviceClass) {

    /*
     * Constructor
     */
    function Vendor(data) {
      this.id = data.id;
      this.name = data.name;
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