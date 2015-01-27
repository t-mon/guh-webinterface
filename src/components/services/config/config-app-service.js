/* Copyright (C) 2015 guh
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 *
 */

 /* Copyright (C) 2015 guh
  *
  * This software may be modified and distributed under the terms
  * of the MIT license.  See the LICENSE file for details.
  *
  */

(function(){
  "use strict";

  angular
   .module('guh.config')
   .factory('appConfig', appConfigFactory);

  appConfigFactory.$inject = [];

  function appConfigFactory() {

    var service = {
      version: '0.1.0'
    };

    return service;

  }

}());