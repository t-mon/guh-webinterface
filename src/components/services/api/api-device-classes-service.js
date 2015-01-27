/* Copyright (C) 2015 guh
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 *
 */

(function(){
  "use strict";

  angular
    .module('guh.components.api')
    .factory('deviceClassesService', deviceClassesService);

  deviceClassesService.$inject = ['$log', 'Restangular'];

  function deviceClassesService($log, Restangular) {
    var service = {
      fetchAll: fetchAll,
      fetch: fetch
    },
    api = Restangular.all('device_classes');

    return service;


    /*
     * Fetch deviceclass list
     */
    function fetchAll() {
      return api.getList();
    }

    /*
     * Fetch deviceClass
     */
    function fetch(id) {
      return api.get(id);
    }
  }

}());