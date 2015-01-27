/* Copyright (C) 2015 guh
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 *
 */

(function(){
  "use strict";

  angular
    .module('guh.components.api', [
      'restangular'    
    ])
    .config(config);

  config.$inject = ['RestangularProvider'];

  function config(RestangularProvider) {
    var port = window.document.location.port;

    // Configure REST-API
    if(port !== '3000') {
      RestangularProvider.setBaseUrl('http://localhost:1234/api/v1');
    } else {
      // RestangularProvider.setBaseUrl('http://localhost:1234/api/v1');
      RestangularProvider.setBaseUrl('/api/v1');
    }
    RestangularProvider.setRequestSuffix('.json');

    RestangularProvider.setRequestInterceptor(function(elem, operation) {
      if (operation === "remove") {
         return undefined;
      } 
      return elem;
    });
  }

}());
