/*
 * Copyright (C) 2015-2016 KeepKey, LLC
 * All Rights Reserved
 */

// var browserify = require('browserify');
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var pbjs = require('gulp-pbjs');
var jsoncombine = require('gulp-jsoncombine');
var _ = require('lodash');
var proto2ts = require('proto2typescript');
var through = require('through2');
var hjson = require('gulp-hjson');
var crypto = require('crypto');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');

const paths = {
  distDirectory: 'dist',
  deviceProfiles: 'device-profiles/*.hjson',
  messagesJs: 'dist/messages.js',
  messagesJson: 'dist/messages.json',
  firmware: 'misc/keepkey_main.bin',
  typescriptSources: [
    'src/**/*.ts', '!src/**/*.spec.ts'
  ],
};

gulp.task('buildDeviceProfiles', function gatherConfigs() {
  return gulp.src(paths.deviceProfiles)
    .pipe(hjson({to: 'json'}))
    .pipe(jsoncombine('device-profiles.json', function (files) {
      return new Buffer('{"deviceProfiles":' + JSON.stringify(_.values(files)) + '}');
    }))
    .pipe(gulp.dest(paths.distDirectory));
});

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

function fileMetaData2Json() {
  return through.obj(function (file, enc, callback) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    if (file.isBuffer()) {
      var versionMarkerLocation = file.contents.indexOf('VERSION');
      if (versionMarkerLocation === -1) {
        throw 'Firmware file needs a version tag';
      }

      var cursor = versionMarkerLocation + 7;
      var nextChar, firmwareVersion = '';
      nextChar = file.contents.slice(cursor++, cursor).toString();

      var max = 20;
      while (nextChar.charCodeAt(0) && max--) {
        firmwareVersion += nextChar;
        nextChar = file.contents.slice(cursor++, cursor).toString();
      }

      if (max < 0) {
        throw 'version string is too long';
      }

      var fileHash = crypto.createHash('sha256');
      fileHash.update(file.contents);

      var fileHashTrezor = crypto.createHash('sha256');
      fileHashTrezor.update(file.contents.slice(256));

      var metaData = {
        file: file.relative,
        digest: fileHash.digest('hex'),
        trezorDigest: fileHashTrezor.digest('hex'),
        size: file.stat.size,
        timeStamp: file.stat.mtime,
        version: firmwareVersion
      };

      file.path = gutil.replaceExtension(file.path, '.json');
      file.contents = new Buffer(JSON.stringify(metaData));
    }


    callback(null, file);
  });
}

gulp.task('extractMetadataFromFirmware', function () {
  return gulp.src(paths.firmware)
    .pipe(fileMetaData2Json())
    .pipe(gulp.dest(paths.distDirectory));
});

function setExtensionToJson(path) {
  path.extname = '.json';
}

function protocolBuffers() {
  return gulp.src('node_modules/device-protocol/messages.proto')
    .pipe(pbjs())
    .pipe(gulp.dest(paths.distDirectory));
}

function extractMessagesJson() {
  return gulp.src(paths.messagesJs)
    .pipe(replace(/^.*\{([\w\W\n\r]+)\}.*$/, '{$1}'))
    .pipe(rename(setExtensionToJson))
    .pipe(gulp.dest(paths.distDirectory));
}

function extractMessagesDts(cb) {
  return gulp.src(paths.messagesJson)
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
    .pipe(gulp.dest(paths.distDirectory))
}


gulp.task('messages.d.ts', gulp.series(
  protocolBuffers,
  extractMessagesJson,
  extractMessagesDts
));

gulp.task('pre-tsc', gulp.series(
  'buildDeviceProfiles',
  'extractMetadataFromFirmware',
  'messages.d.ts'
));

module.exports = gulp;