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
      src + '/components/filters/filters.js',
      src + '/components/filters/**/*.js',
      src + '/components/services/api/api.js',
      src + '/components/services/api/*.js',
      src + '/components/services/helper/helper.js',
      src + '/components/services/helper/*.js',
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
