/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                                                                                     *
 * Copyright (C) 2015 Lukas Mayerhofer <lukas.mayerhofer@guh.guru>                     *
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

(function() {
  'use strict';

  angular
    .module('guh.config')
    .constant('guhTypes', {
      inputTypes: {
        ipV4Address: '-ipV4',
        ipV6Address: '-ipV6',
        macAddress: '-mac',
        mail: '-mail',
        password: '-password',
        search: '-search',
        textLine: '-text',
        textArea: '-textarea',
        url: '-url'
      },

      notificationTypes: {
        // Devices
        devices: {
          deviceAdded: 'Devices.DeviceAdded',
          deviceParamsChanged: 'Devices.DeviceParamsChanged',
          deviceRemoved: 'Devices.DeviceRemoved',
          stateChanged: 'Devices.StateChanged'
        },

        // Events
        events: {
          eventTriggered: 'Events.EventTriggered'
        },

        // Log entry
        logging: {
          logDatabaseUpdated: 'Logging.LogDatabaseUpdated',
          logEntryAdded: 'Logging.LogEntryAdded'
        },

        // Rules
        rules: {
          ruleActiveChanged: 'Rules.RuleActiveChanged',
          ruleConfigurationChanged: 'Rules.RuleConfigurationChanged',
          ruleAdded: 'Rules.RuleAdded',
          ruleRemoved: 'Rules.RuleRemoved'
        }
      },

    });

}());