/* Copyright (C) 2015 guh
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 *
 */

(function(){
  "use strict";

  angular
    .module('guh', [
      // Angular dependencies
      'ngMessages',

      // Other dependencies
      'ui.router',

      // Components
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
      .otherwise('/dashboard');

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