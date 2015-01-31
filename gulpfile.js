/* Copyright (C) 2015 guh
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 *
 */

// Node
var del = require('del');
var browserSync = require('browser-sync');
var mainBowerFiles = require('main-bower-files');
var karma = require('karma');

// Node-Gulp
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

// Config
var browserSyncConfig = require('./config/gulp').browserSync;
var generalConfig = require('./config/gulp').general;
var copyBuildConfig = require('./config/gulp').copyBuild;
var markupConfig = require('./config/gulp').markup;
var scriptsConfig = require('./config/gulp').scripts;
var stylesConfig = require('./config/gulp').styles;
var svgConfig = require('./config/gulp').svg;

// Bower
gulp.task('bower', function() {
  gulp.src(mainBowerFiles(), {base: 'bower_components'})
    .pipe(gulp.dest(generalConfig.dest + '/assets/lib'));
});

// BrowserSync
gulp.task('browserSync', ['build'], function() {
  browserSync(browserSyncConfig);
});

// Clean
gulp.task('clean', function() {
  return del([generalConfig.dest], {force: true});
});

// copyBuild
gulp.task('copyBuild', ['clean', 'svgSprite'], function() {
  return gulp.src(copyBuildConfig.src)
    .pipe(gulp.dest(copyBuildConfig.dest));
});

// Markup
gulp.task('markup', function() {
  gulp.src(markupConfig.src)
    .pipe(gulp.dest(markupConfig.dest))
    .pipe(browserSync.reload({stream:true}));
});

// Scripts
gulp.task('scripts', function() {
  gulp.src(scriptsConfig.src)
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.plumber())
      .pipe(plugins.jshint(generalConfig.config + '/jshint.js'))
      .pipe(plugins.jshint.reporter('jshint-stylish'))
      .pipe(plugins.concat('app.js'))
      .pipe(plugins.size({
        showFiles: true
      }))
      .pipe(plugins.ngAnnotate())
      .pipe(plugins.uglify({
        mangle: false
      }))
      .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.sourcemaps.write('/sourcemaps'))
    .pipe(plugins.size({
      showFiles: true
    }))
    .pipe(plugins.plumber.stop())
    .pipe(gulp.dest(scriptsConfig.dest))
    .pipe(browserSync.reload({stream:true}));
});

// svgSprite
gulp.task('svgSprite', function() {
  return gulp.src(svgConfig.srcVendors)
    .pipe(plugins.svgSprite({
      mode: {
        css: {
          common: 'vendor',
          dest: '',
          dimensions: false,
          example: {
            dest: 'assets/svg/sprites-example.html'
          },
          layout: 'packed',
          prefix: 'vendor-%s',
          render: {
            scss: {
              dest: 'scss/base/_sprites.scss',
              template: 'src/assets/svg/svg-sprite-template.scss'
            }
          },
          sprite: 'assets/svg/sprites.svg'
        }
      }
    }))
    .pipe(gulp.dest(svgConfig.dest));
});

// Styles
gulp.task('styles', function() {
  // Process, concat, minify styles and add sourcemaps
  gulp.src(stylesConfig.srcMain)
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.plumber())
      .pipe(plugins.sass(stylesConfig.settings))
      // .on('error', handleErrors)
      .pipe(plugins.concat('app.css'))
      .pipe(plugins.size({
        showFiles: true
      }))
      // .pipe(plugins.minifyCss())
      .pipe(plugins.rename({suffix: '.min'}))
    .pipe(plugins.sourcemaps.write('/sourcemaps'))
    .pipe(plugins.size({
      showFiles: true
    }))
    .pipe(plugins.plumber.stop())
    .pipe(gulp.dest(stylesConfig.dest))
    .pipe(browserSync.reload({stream:true}));

  // Copy SVG-Sprite files
  // gulp.src(svgConfig.srcSprite)
  //   .pipe(svgConfig.dest(copyBuildConfig.dest));
});

// Test
gulp.task('test-unit', function(cb) {
  karma.server.start({
    configFile: __dirname + '/config/karma-unit.js',
    singleRun: false
  }, cb);
});

// Build
// gulp.task('build', ['clean', 'svgSprite', 'copyBuild'], function() {
gulp.task('build', ['copyBuild'], function() {
  gulp.start('bower', 'markup', 'scripts', 'styles');
});

// Default
gulp.task('default', ['build']);

// Development
gulp.task('dev', ['browserSync', 'build'], function() {
  gulp.watch(markupConfig.src, ['markup']);
  gulp.watch(scriptsConfig.src, ['scripts']);
  gulp.watch(stylesConfig.src, ['styles']);
});
