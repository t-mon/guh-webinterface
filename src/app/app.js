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
    .module('guh', [
      // Angular dependencies
      'ngMessages',

      // Other dependencies
      'ui.router',

      // Components
      'guh.components.filters',
      'guh.components.api',
      'guh.components.models',
      'guh.components.ui',

      // App
      'guh.config',
      'guh.devices',
      'guh.rules'
    ])
    .config(config);

  config.$inject = ['$urlRouterProvider', '$stateProvider'];

  function config($urlRouterProvider, $stateProvider) {
    $urlRouterProvider
      .when('/devices', '/devices/all')
      .when('/devices/detail', '/devices/all')
      .when('/rules', '/rules/all')
      .when('/rules/detail', '/rules/all')
      .otherwise('/devices');

    $stateProvider
      .state('guh', {
        abstract: true,
        views: {
          'app': {
            controller: 'GuhController',
            controllerAs: 'guh',
            templateUrl: 'app/app.html'
          },
          'navigation@guh': {
            templateUrl: 'app/layout-modules/navigation.html'
          },
          'header@guh': {
            templateUrl: 'app/layout-modules/header.html'
          }
        }
      })
      .state('guh.dashboard', {
        url: '/dashboard'
      })
      .state('guh.devices', {
        abstract: true,
        template: '<ui-view/>',
        url: '/devices'
      })
      .state('guh.devices.master', {
        url: '/all',
        views: {
          'main@guh': {
            controller: 'DevicesMasterController',
            controllerAs: 'devices',
            templateUrl: 'app/devices/master/devices-master.html'
          },
          'navigation@guh': {
            templateUrl: 'app/devices/master/layout-modules/navigation.html'
          },
          'header@guh': {
            templateUrl: 'app/devices/master/layout-modules/header.html'
          }
        }
      })
      .state('guh.devices.detail', {
        // url: '/:id/',
        url: '/detail',
        params: { id: {} },
        views: {
          'main@guh': {
            controller: 'DevicesDetailController',
            controllerAs: 'device',
            templateUrl: 'app/devices/detail/devices-detail.html'
          },
          'navigation@guh': {
            templateUrl: 'app/devices/detail/layout-modules/navigation.html'
          },
          'header@guh': {
            templateUrl: 'app/devices/detail/layout-modules/header.html'
          }
        }
      })
      .state('guh.devices.add', {
        url: '/add',
        views: {
          'main@guh': {
            controller: 'DevicesAddController',
            controllerAs: 'addDevice',
            templateUrl: 'app/devices/add/devices-add.html'
          },
          'navigation@guh': {
            templateUrl: 'app/devices/add/layout-modules/navigation.html'
          },
          'header@guh': {
            templateUrl: 'app/devices/add/layout-modules/header.html'
          }
        }
      })
      .state('guh.rules', {
        abstract: true,
        template: '<ui-view/>',
        url: '/rules'
      })
      .state('guh.rules.master', {
        url: '/all',
        views: {
          'main@guh': {
            controller: 'RulesMasterController',
            controllerAs: 'rules',
            templateUrl: 'app/rules/master/rules-master.html'
          },
          'navigation@guh': {
            templateUrl: 'app/rules/master/layout-modules/navigation.html'
          },
          'header@guh': {
            templateUrl: 'app/rules/master/layout-modules/header.html'
          }
        }
      })
      .state('guh.rules.detail', {
        // url: '/:id/',
        url: '/detail',
        params: { id: {} },
        views: {
          'main@guh': {
            controller: 'RulesDetailController',
            controllerAs: 'rule',
            templateUrl: 'app/rules/detail/rules-detail.html'
          },
          'navigation@guh': {
            templateUrl: 'app/rules/detail/layout-modules/navigation.html'
          },
          'header@guh': {
            templateUrl: 'app/rules/detail/layout-modules/header.html'
          }
        }
      })
      .state('guh.rules.add', {
        url: '/add',
        views: {
          'main@guh': {
            controller: 'RulesAddController',
            controllerAs: 'addRule',
            templateUrl: 'app/rules/add/rules-add.html'
          },
          'navigation@guh': {
            templateUrl: 'app/rules/add/layout-modules/navigation.html'
          },
          'header@guh': {
            templateUrl: 'app/rules/add/layout-modules/header.html'
          }
        }
      })
      .state('guh.rules.add.event', {
        url: '/event',
        views: {
          'main@guh': {
            templateUrl: 'app/rules/add/rules-add-event.html'
          }
        }
      })
      .state('guh.rules.add.state', {
        url: '/state',
        views: {
          'main@guh': {
            templateUrl: 'app/rules/add/rules-add-state.html'
          }
        }
      })
      .state('guh.rules.add.action', {
        url: '/action',
        views: {
          'main@guh': {
            templateUrl: 'app/rules/add/rules-add-action.html'
          }
        }
      });
  }

}());