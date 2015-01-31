/* Copyright (C) 2015 guh
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 *
 */

// General
var src = './src';
var dest =  './build';
var config = './config';

// Task: styles
var bourbon = require('node-bourbon');

module.exports = {
  browserSync: {
    files: [
      '!' + dest + '/assets/fonts/**/*',
      '!' + dest + '/sourcemaps/*.map'
    ],
    open: false,
    port: 1234,
    proxy: "localhost:3000",
    // server: {
    //   baseDir: [dest]
    // }
  },
  general: {
    src: src,
    dest: dest,
    config: config
  },
  copyBuild: {
    src: src + '/**/*.{scss,js,html,eot,ttf,woff,woff2,svg,png,jpg,jpeg,gif}',
    dest: dest
  },
  markup: {
    src: src + '/**/*.html',
    dest: dest
  },
  scripts: {
    src: [
      // Components: Services
      src + '/components/services/config/config.js',
      src + '/components/services/config/*.js',
      src + '/components/services/api/api.js',
      src + '/components/services/api/*.js',
      src + '/components/services/models/models.js',
      src + '/components/services/models/*.js',

      // Components: Directives
      src + '/components/directives/ui.js',
      src + '/components/directives/**/*.js',

      // App
      src + '/app/app.js',
      src + '/app/app-controller.js',

      // App: Devices
      src + '/app/devices/devices.js',
      src + '/app/devices/**/*.js',

      // App: Rules
      src + '/app/rules/rules.js',
      src + '/app/rules/**/*.js',
    ],
    dest: dest
  },
  styles: {
    src: src + '/**/*.scss',
    srcMain: src + '/app/app.scss',
    dest: dest,
    settings: {
      errLogToConsole: true,
      includePaths: bourbon.includePaths
    }
  },
  svg: {
    srcVendors: src + '/assets/svg/vendors/*.svg',
    // srcSprites: src + '/scss/sprites/**/*.svg',
    dest: src
    // dest: src + '/scss/sprites'
  }
};