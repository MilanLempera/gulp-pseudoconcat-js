/* jshint node: true */
/* global describe, it */

'use strict';

var assert = require('assert'),
  gutil = require('gulp-util'),
  PassThrough = require('stream').PassThrough,
  path = require('path'),
  pseudoconcat = require('./index');

describe('gulp-pseudoconcat-js', function() {
  var onDataCalled;

  beforeEach(function(done) {
    onDataCalled = false;
    done();
  });

  it('should transform files to <script>', function(done) {
    var stream = pseudoconcat('file.js');
    var fakeFile = new gutil.File({
      path: 'file1-path.js',
      contents: new Buffer('file1-content')
    });

    var fakeFile2 = new gutil.File({
      path: 'file2-path.js',
      contents: new Buffer('file2-content')
    });

    stream.on('data', function(newFile) {
      onDataCalled = true;
      assert.equal('document.write(\'<script src="file1-path.js"></script><script src="file2-path.js"></script>\');', newFile.contents.toString());
    });

    stream.on('end', function() {
      assert.ok(onDataCalled, 'on data was called');
      done();
    });

    stream.write(fakeFile);
    stream.write(fakeFile2);
    stream.end();
  });

  it('should preserve full path without options.webRoot', function(done) {
    var stream = pseudoconcat('file.js');
    var fakeFile = new gutil.File({
      path: 'project/src/frontend/first.js',
      contents: new Buffer('file1-content')
    });

    stream.on('data', function(newFile) {
      onDataCalled = true;
      assert.equal('document.write(\'<script src="project/src/frontend/first.js"></script>\');', newFile.contents.toString());
    });

    stream.on('end', function() {
      assert.ok(onDataCalled, 'on data was called');
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('should derive path from webRoot', function(done) {
    var stream = pseudoconcat('file.js', {webRoot: 'project/src'});
    var fakeFile = new gutil.File({
      path: 'project/src/frontend/first.js',
      contents: new Buffer('file1-content')
    });

    stream.on('data', function(newFile) {
      onDataCalled = true;
      assert.equal('document.write(\'<script src="frontend/first.js"></script>\');', newFile.contents.toString());
    });

    stream.on('end', function() {
      assert.ok(onDataCalled, 'on data was called');
      done();
    });

    stream.write(fakeFile);
    stream.end();
  });

  it('should not work in stream mode', function(done) {
    var stream = pseudoconcat('file.js');
    var fakeStream = new PassThrough();
    var fakeFile = new gutil.File({
      contents: fakeStream
    });

    stream.on('error', function(error) {
      assert.equal(error.message, 'Streaming not supported');
      done();
    });
    stream.write(fakeFile);
  });

  it('should not fail if no files were input', function(done) {
    var stream = pseudoconcat('test.js');
    stream.end();
    done();
  });

  describe('on windows', function() {
    var path_sep_original = path.sep;

    before(function(done) {
      path.sep = '\\';
      done();
    });

    after(function(done) {
      path.sep = path_sep_original;
      done();
    });

    it('convert path to url', function(done) {
      var stream = pseudoconcat('file.js');
      var fakeFile = new gutil.File({
        path: 'src\\frontend\\first.js',
        contents: new Buffer('file1-content')
      });

      stream.on('data', function(newFile) {
        onDataCalled = true;
        assert.equal('document.write(\'<script src="src/frontend/first.js"></script>\');', newFile.contents.toString());
      });

      stream.on('end', function() {
        assert.ok(onDataCalled, 'on data was called');
        done();
      });

      stream.write(fakeFile);
      stream.end();
    });

  });

});
