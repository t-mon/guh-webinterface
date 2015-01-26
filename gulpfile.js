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
gulp.task('copyBuild', function() {
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

// Styles
gulp.task('styles', function() {
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
});

// Test
gulp.task('test-unit', function(cb) {
  karma.server.start({
    configFile: __dirname + '/config/karma-unit.js',
    singleRun: false
  }, cb);
});

// Build
gulp.task('build', ['clean', 'copyBuild'], function() {
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
