/**
 * @license
 * Copyright 2017 KeepKey, LLC.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 * CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

let gulp = require('gulp');
let gutil = require('gulp-util');
let rename = require('gulp-rename');
let replace = require('gulp-replace');
let pbjs = require('gulp-pbjs');
let jsoncombine = require('gulp-jsoncombine');
let _ = require('lodash');
let proto2ts = require('proto2typescript');
let through = require('through2');
let hjson = require('gulp-hjson');
let crypto = require('crypto');
let ts = require('gulp-typescript');
let bump = require('gulp-bump');

const paths = {
  distDirectory: 'dist',
  deviceProfiles: 'device-profiles/*.hjson',
  messagesJs: 'dist/messages.js',
  messagesJson: 'dist/messages.json',
  firmware: 'misc/*.bin',
  typescriptSources: [
    'src/**/*.ts', '!src/**/*.spec.ts'
  ],
  versionedFiles: ['package.json', 'README.md']
};

gulp.task('buildDeviceProfiles', function gatherConfigs() {
  return gulp.src(paths.deviceProfiles)
    .pipe(hjson({to: 'json'}))
    .pipe(jsoncombine('device-profiles.json', function (files) {
      return new Buffer(JSON.stringify(_.values(files)));
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

function extractString(file, cursor) {
  var nextChar, str = '';
  nextChar = file.contents.slice(cursor++, cursor).toString();

  var max = 20;
  while (nextChar.charCodeAt(0) && max--) {
    str += nextChar;
    nextChar = file.contents.slice(cursor++, cursor).toString();
  }

  if (max < 0) {
    throw 'version string is too long';
  }
  return str;
}

const MODEL_NUMBERS = {
  "firmware.keepkey.bin": 'K1-14AM',
  "firmware.salt.bin": 'K1-14WL-S',
};

function fileMetaData2Json() {
  return through.obj(function (file, enc, callback) {
    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'));
      return cb();
    }

    if (file.isBuffer()) {
      let modelNumber = MODEL_NUMBERS[file.relative];

      var versionMarkerLocation = file.contents.indexOf('VERSION');
      if (versionMarkerLocation === -1) {
        throw 'Firmware file needs a version tag';
      }
      var firmwareVersion = extractString(file, versionMarkerLocation + 7);

      var fileHash = crypto.createHash('sha256');
      fileHash.update(file.contents);

      var fileHashTrezor = crypto.createHash('sha256');
      fileHashTrezor.update(file.contents.slice(256));

      var isBootloaderUpdater = file.relative == 'blupdate.bin';

      var metaData = {
        file: file.relative,
        digest: fileHash.digest('hex'),
        trezorDigest: fileHashTrezor.digest('hex'),
        size: file.stat.size,
        timeStamp: file.stat.mtime,
        version: firmwareVersion,
        modelNumber: modelNumber,
        isBootloaderUpdater: isBootloaderUpdater
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
    .pipe(jsoncombine('firmware.json', function (files) {
      return new Buffer(JSON.stringify(_.values(files)));
    }))
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

function copyDtsToDist() {
  return gulp.src('src/**/*.d.ts')
    .pipe(gulp.dest(paths.distDirectory));
}

gulp.task('pre-tsc', gulp.series(
  'buildDeviceProfiles',
  'extractMetadataFromFirmware',
  'messages.d.ts',
  copyDtsToDist
));

module.exports = gulp;
