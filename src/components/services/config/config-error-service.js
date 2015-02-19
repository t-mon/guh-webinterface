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
   .module('guh.config')
   .factory('errors', errorsFactory);

  errorsFactory.$inject = [];

  function errorsFactory() {

    var service = {
      device: getDeviceErrorMessages
    };

    return service;

    function getDeviceErrorMessages() {
      return {
        DeviceErrorNoError: 'No Error. Everything went fine.',
        DeviceErrorPluginNotFound: 'Couldn\'t find the Plugin for the given id.',
        DeviceErrorDeviceNotFound: 'Couldn\'t find a Device for the given id.',
        DeviceErrorDeviceClassNotFound: 'Couldn\'t find a DeviceClass for the given id.',
        DeviceErrorActionTypeNotFound: 'Couldn\'t find the ActionType for the given id.',
        DeviceErrorStateTypeNotFound: 'Couldn\'t find the StateType for the given id.',
        DeviceErrorEventTypeNotFound: 'Couldn\'t find the EventType for the given id.',
        DeviceErrorDeviceDescriptorNotFound: 'Couldn\'t find the DeviceDescriptor for the given id.',
        DeviceErrorMissingParameter: 'Parameters do not comply to the template.',
        DeviceErrorInvalidParameter: 'One of the given parameter is not valid.',
        DeviceErrorSetupFailed: 'Error setting up the Device. It will not be functional.',
        DeviceErrorDuplicateUuid: 'Error setting up the Device. The given DeviceId already exists.',
        DeviceErrorCreationMethodNotSupported: 'Error setting up the Device. This CreateMethod is not supported for this Device.',
        DeviceErrorSetupMethodNotSupported: 'Error setting up the Device. This SetupMethod is not supported for this Device.',
        DeviceErrorHardwareNotAvailable: 'The Hardware of the Device is not available.',
        DeviceErrorHardwareFailure: 'The Hardware of the Device has an error.',
        DeviceErrorAsync: 'The response of the Device will be asynchronously.',
        DeviceErrorDeviceInUse: 'The Device is currently bussy.',
        DeviceErrorPairingTransactionIdNotFound: 'Couldn\'t find the PairingTransactionId for the given id.'
      };
    }

  }

}());