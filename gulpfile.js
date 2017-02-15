/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

// var browserify = require('browserify');
var gulp = require('gulp');
// var source = require('vinyl-source-stream');
// var buffer = require('vinyl-buffer');
// var bump = require('gulp-bump');
// var zip = require('gulp-zip');
// var args = require('yargs').argv;
// var yaml = require('gulp-yaml');
var rename = require('gulp-rename');
// var del = require('del');
// var mocha = require('gulp-mocha');
var replace = require('gulp-replace');
var pbjs = require('gulp-pbjs');
// var jsoncombine = require('gulp-jsoncombine');
// var shell = require('gulp-shell');
// var _ = require('lodash');
var proto2ts = require('proto2typescript');
var through = require('through2');
// var download = require('gulp-download');
// var gulpTypings = require("gulp-typings");
// var hjson = require('gulp-hjson');
// var es6toes5 = require('gulp-babel');
// var minifyHTML = require('gulp-minify-html');
// var insert = require('gulp-insert');
// var merge2 = require('merge2');
//
// var environment = args.environment || 'local';
//
// var fileMetaData2Json = require('./gulp-fileMetaData2Json');
//
// var ts = require('gulp-typescript');

const paths = {
  // distributionDirectory: 'dist',
  // distributionFiles: 'dist/**/*',
  // buildDirectory: 'build',
  // deviceProfiles: 'config/device-profiles/*.hjson',
  // configFragments: [
  //   'config/global.hjson', 'config/environment-configs/' + environment + '.hjson'
  // ],
  // configFileName: 'config.json',
  // typingsConfigutation: './typings.json',
  // backgroundJs: './build/Background.js',
  // sourceImages: 'src/images/**/*',
  // versionedFiles: [
  //   'manifest.json', 'package.json'
  // ],
  messagesJs: 'build/keepkey/messages.js',
  // typescriptSources: [
  //   'typings/index.d.ts', 'src/**/*.ts', '!src/**/*.spec.ts'
  // ],
  // vendorScripts: [
  //   'node_modules/angular/angular.min.js',
  //   'node_modules/angular-animate/angular-animate.min.js',
  //   'node_modules/angular-route/angular-route.min.js',
  //   'node_modules/angular-messages/angular-messages.min.js',
  //   'node_modules/angular-ui-bootstrap/dist/ui-bootstrap.js',
  //   'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls.js',
  //   'node_modules/lodash/lodash.min.js',
  //   'node_modules/qrcode-generator/js/qrcode.js',
  //   'node_modules/angular-qrcode/angular-qrcode.js',
  //   'node_modules/clipboard/dist/clipboard.min.js',
  //   'node_modules/bignumber.js/bignumber.min.js',
  //   'node_modules/clipboard/dist/clipboard.min.js'
  // ],
  // uiDestination: 'dist/chrome-wallet',
  // libFilesDestination: 'dist/chrome-wallet/lib',
  // semverSource: 'node_modules/semver/semver.js',
  // sourceHtmlFiles: 'src-ui/*.html',
  // uiAssetsSource: 'src-ui/assets/**/*',
  // uiAssetsDestination: 'dist/chrome-wallet/assets',
  // uiFontsSource: [
  //   'src-ui/fonts/**/*',
  //   'node_modules/font-awesome/fonts/fontawesome-webfont.woff2'
  // ],
  // uiFontsDestination: 'dist/chrome-wallet/fonts',
  // commonModuleSourceScripts: [
  //   'license-header.js',
  //   'src-ui/app/common/common.js',
  //   'src-ui/app/common/**/*.js',
  //   '!src-ui/app/common/**/*.spec.js'
  // ],
  // commonModuleTemplateFiles: 'src-ui/app/common/**/*.tpl.html',
  // popupModuleSourceScripts: [
  //   'license-header.js',
  //   'src-ui/app/popup/popup.js',
  //   'src-ui/app/popup/**/*.js',
  //   '!src-ui/app/popup/**/*.spec.js'
  // ],
  // popupModuleTemplateFiles: 'src-ui/app/popup/**/*.tpl.html',
  // transactionModuleSourceScripts: [
  //   'license-header.js',
  //   'src-ui/app/transactions/transactions.js',
  //   'src-ui/app/transactions/**/*.js',
  //   '!src-ui/app/transactions/**/*.spec.js'
  // ],
  // transactionModuleTemplateFiles: 'src-ui/app/transactions/**/*.tpl.html',
  // cssSourceFiles: [
  //   'node_modules/angular/angular-csp.css',
  //   'node_modules/angular-ui-bootstrap/dist/ui-bootstrap-csp.css',
  //   'src-ui/styles/*.css'
  // ],
  // lessSourceFiles: 'src-ui/styles/*.less',
  // cssDestination: 'dist/chrome-wallet/styles'
};

// var babelOptions = (environment === 'local') ? {
//     comments: false,
//     minified: false,
//     compact: false,
//     presets: ['es2015']
//   } : {
//     comments: false,
//     minified: true,
//     compact: true,
//     presets: ['babili', 'es2015']
//   };
//
// gulp.task('clean', function (cb) {
//   del([
//     paths.distributionDirectory,
//     '*.zip',
//     paths.buildDirectory,
//     'bin',
//     'vendor',
//     'node_modules',
//     'typings'
//   ], cb);
// });
//
// function gatherConfigs() {
//   function buildDeviceCapabilitiesConfig() {
//     return gulp.src(paths.deviceProfiles)
//       .pipe(hjson({to: 'json'}))
//       .pipe(jsoncombine('device-profiles.json', function (files) {
//         return new Buffer('{"deviceProfiles":' + JSON.stringify(_.values(files)) + '}');
//       }));
//   }
//
//   function buildOtherConfig() {
//     return gulp.src(paths.configFragments)
//       .pipe(hjson({to: 'json'}))
//   }
//
//   return merge2(buildDeviceCapabilitiesConfig(), buildOtherConfig())
//     .pipe(jsoncombine(paths.configFileName, function (files) {
//       return new Buffer(JSON.stringify(_.merge.apply(_, _.values(files))));
//     }));
//
// }
//
// function writeConfig() {
//   return gatherConfigs()
//     .pipe(gulp.dest(paths.distributionDirectory));
// }
//
// gulp.task('buildConfig', gulp.series(writeConfig));
//
// function installTypings() {
//   return gulp.src(paths.typingsConfigutation)
//     .pipe(gulpTypings()); //will install all typings files in pipeline.
// }
//
// gulp.task('browserify', function () {
//   return browserify(paths.backgroundJs)
//     .bundle()
//     .pipe(source('Background.js'))
//     .pipe(buffer()) // <----- convert from streaming to buffered vinyl file object
//     .pipe(es6toes5(babelOptions))
//     .pipe(gulp.dest(paths.distributionDirectory));
// });
//
// gulp.task('watch', function () {
//   return gulp.watch(['src/**/*', 'gulpfile.js', 'package.json', 'manifest.json', 'config'], ['build']);
// });
//
// gulp.task('copyAssets', function () {
//   return gulp.src(paths.sourceImages)
//     .pipe(gulp.dest('dist/images'));
// });

gulp.task('bumpPatch', function () {
  return gulp.src(paths.versionedFiles)
    .pipe(bump({type: 'patch'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bumpMinor', function () {
  return gulp.src(paths.versionedFiles)
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bumpMajor', function () {
  return gulp.src(paths.versionedFiles)
    .pipe(bump({type: 'major'}))
    .pipe(gulp.dest('./'));
});

function protocolBuffers() {
  return gulp.src('node_modules/device-protocol/messages.proto')
    .pipe(pbjs())
    .pipe(gulp.dest('build/keepkey'));
}

// function extractMetadataFromFirmware() {
//   return gulp.src('dist/keepkey_main.bin')
//     .pipe(fileMetaData2Json())
//     .pipe(gulp.dest(paths.buildDirectory));
// }

// function downloadFirmwareUsingGulpDownload() {
//   // FIXME: This is broken for private repos.
//   var config = require('./dist/config.json');
//   var url = "https://github.com/keepkey/" + config.firmware.repository +
//     "/releases/download/" + config.firmware.tag + "/keepkey_main.bin";
//   return download(url)
//     .pipe(gulp.dest('dist/'));
// }

// function useFirmwareFromMiscDirectory() {
//   return gulp.src('misc/keepkey_main.bin')
//     .pipe(gulp.dest('dist/'));
// }

// gulp.task('downloadFirmware', gulp.series(downloadFirmwareUsingGulpDownload));

// gulp.task('bin2js', gulp.series(
//   'buildConfig',
//   'downloadFirmware',
//   extractMetadataFromFirmware
// ));

function setExtensionToJson(path) {
  path.extname = '.json';
}

function extractMessagesJson() {
  return gulp.src(paths.messagesJs)
    .pipe(replace(/^.*\{([\w\W\n\r]+)\}.*$/, '{$1}'))
    .pipe(rename(setExtensionToJson))
    .pipe(gulp.dest('build/keepkey'));
}

function extractMessagesDts(cb) {
  return gulp.src('build/keepkey/messages.json')
    .pipe(through.obj(function (file, enc, cb) {
      var protoJson = JSON.parse(file.contents);
      protoJson.package = 'DeviceMessages';
      var result = proto2ts(JSON.stringify(protoJson), {
        camelCaseGetSet: true,
        properties: true,
        underscoreGetSet: false
      }, function (err, out) {
        file.contents = new Buffer(out);
        cb(err, file);
      });
    }))
    .pipe(replace(/delete/g, 'isDelete'))
    .pipe(replace(/null/g, 'isNull'))
    .pipe(rename(function (path) {
      path.basename += '.d';
      path.extname = '.ts';
    }))
    .pipe(gulp.dest('build/keepkey'))
}


gulp.task('messages.d.ts', gulp.series(
  protocolBuffers,
  extractMessagesJson,
  extractMessagesDts
));


// function tsc() {
//   return gulp.src(paths.typescriptSources)
//     .pipe(ts({
//       "target": "es5",
//       "lib": [
//         "dom", "es5", "es2015.core", "es2015.promise", "scripthost"
//       ],
//       "module": "commonjs",
//       "declaration": false,
//       "removeComments": true,
//       "noUnusedLocals": true,
//       "traceResolution": true,
//       "allowJs": true
//     })).js
//     .pipe(gulp.dest(paths.buildDirectory));
// }
//
// gulp.task('typescript', gulp.series(
//   'buildConfig',
//   'messages.d.ts',
//   installTypings,
//   tsc
// ));
//
// gulp.task('background.js', gulp.series(
//   gulp.parallel('typescript', protocolBuffers, 'buildConfig', 'bin2js'),
//   'browserify'
// ));
//
// gulp.task('buildProxy', gulp.series('copyManifest', 'buildConfig', 'background.js', 'copyAssets', 'html', 'zip'));
//
// function copyJsLibFiles() {
//   return gulp.src(paths.vendorScripts)
//     .pipe(gulp.dest(paths.libFilesDestination))
// }
//
// function processHtmlFiles() {
//   return gulp.src(paths.sourceHtmlFiles)
//     .pipe(minifyHTML({}))
//     .pipe(gulp.dest(paths.uiDestination));
// }
//
// function copyAssets() {
//   return gulp.src(paths.uiAssetsSource)
//     .pipe(gulp.dest(paths.uiAssetsDestination));
// }
//
// function copyFonts() {
//   return gulp.src(paths.uiFontsSource)
//     .pipe(gulp.dest(paths.uiFontsDestination));
// }
//
// function browserifySemver() {
//   return gulp.src(paths.semverSource)
//     .pipe(insert.prepend(";(function(exports) { if (false) "))
//     .pipe(insert.append("})(typeof exports === 'object' ? exports : typeof define === 'function' && define.amd ? {} : window.semver = {});"))
//     .pipe(es6toes5(babelOptions))
//     .pipe(gulp.dest(paths.libFilesDestination))
//
// }
//
// var manifest = require('./manifest.json');
// var templateCache = require('gulp-angular-templatecache');
// var concat = require('gulp-concat');
// var ngConstant = require('gulp-ng-constant');
//
// function appScriptBuilder(moduleName, angularModuleName, sources, templateSourceFiles, includeConstants) {
//   var templateRootPath = 'app/' + moduleName;
//   var outputFileName = moduleName + '.js';
//
//   function prepareTemplateCache() {
//     return gulp.src(templateSourceFiles)
//       .pipe(minifyHTML())
//       .pipe(templateCache({
//         root: templateRootPath,
//         module: angularModuleName
//       }));
//   }
//
//   function buildAngularConfig() {
//     return gatherConfigs()
//       .pipe(ngConstant({
//         name: angularModuleName,
//         constants: {VERSION: manifest.version},
//         deps: false,
//         wrap: false
//       }));
//   }
//
//   var streams = [gulp.src(sources), prepareTemplateCache()];
//   if (includeConstants) {
//     streams.push(buildAngularConfig());
//   }
//
//   return merge2.apply(this, streams)
//     .pipe(concat(outputFileName))
//     .pipe(es6toes5(babelOptions))
//     .pipe(gulp.dest(paths.uiDestination));
// }
//
// var cleanCss = require('gulp-clean-css');
// var less = require('gulp-less');
// var path = require('path');
//
// function css() {
//   function buildLess() {
//     return gulp.src(paths.lessSourceFiles)
//       .pipe(less());
//   }
//
//   return merge2(buildLess(), gulp.src(paths.cssSourceFiles))
//     .pipe(cleanCss())
//     .pipe(gulp.dest(paths.cssDestination));
// }
//
//
// gulp.task('buildCommon', appScriptBuilder.bind(this, 'common', 'kkCommon', paths.commonModuleSourceScripts, paths.commonModuleTemplateFiles, true));
// gulp.task('buildPopup', appScriptBuilder.bind(this, 'popup', 'kkWallet', paths.popupModuleSourceScripts, paths.popupModuleTemplateFiles, false));
// gulp.task('buildTransactions', appScriptBuilder.bind(this, 'transactions', 'kkTransactions', paths.transactionModuleSourceScripts, paths.transactionModuleTemplateFiles, false));
//
// gulp.task('buildUi', gulp.parallel(copyJsLibFiles, browserifySemver, processHtmlFiles, 'buildCommon', 'buildPopup', 'buildTransactions', copyAssets, copyFonts, css));
//
// gulp.task('build', gulp.parallel('buildProxy', 'buildUi'));


module.exports = gulp;