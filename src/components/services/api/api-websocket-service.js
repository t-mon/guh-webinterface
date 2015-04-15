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
    .module('guh.components.api')
    .factory('websocketService', websocketService);

  websocketService.$inject = ['$log', '$rootScope'];

  function websocketService($log, $rootScope) {

    var service = {
      // Objects
      ws: null,
      callbacks: {},

      // Methods
      connect: connect,
      subscribe: subscribe,
      unsubscribe: unsubscribe
    };

    return service;


    function connect() {
      if(service.ws) {
        return;
      }

      var protocol = (window.location.protocol === 'http:') ? 'ws' : 'wss';
      var host = window.location.hostname;
      var port = window.location.port;
      var ws = new ReconnectingWebSocket(protocol + '://' + host + ':' + port + '/ws');

      ws.onopen = function(event) {
        $log.log('Successfully connected with websocket.', event);

        // Send broadcast event
        $rootScope.$apply(function() {
          $rootScope.$broadcast('WebsocketConnected', '');
        });
      };

      ws.onclose = function(event) {
        $log.log('Closed websocket connection.', event);

        // Send broadcast event
        $rootScope.$apply(function() {
          $rootScope.$broadcast('WebsocketConnectionLost', 'The app has lost the connection to guh. Please check if you are connected to your network and if guh is running correctly.');
        });
      };

      ws.onerror = function() {
        $log.error('There was an error with the websocket connection.');
      };

      ws.onmessage = function(message) {
        // $log.log('message', angular.fromJson(message.data));

        // Execute callback-function with right ID
        angular.forEach(service.callbacks, function(cb) {
          cb(angular.fromJson(message.data));
        });
      };

      service.ws = ws;
    }

    function subscribe(deviceId, cb) {
      if(!service.ws) {
        service.connect();
      }

      service.callbacks[deviceId] = cb;
    }

    function unsubscribe(deviceId) {
      delete service.callbacks[deviceId];
    }

  }

}());