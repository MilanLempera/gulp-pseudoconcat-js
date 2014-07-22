/* jshint node: true */
/* global describe, it */

'use strict';

var assert = require('assert'),
  gutil = require('gulp-util'),
  PassThrough = require('stream').PassThrough,
  pseudoconcat = require('./index');


describe('gulp-pseudoconcat-js', function() {
  it('should transform files to <script>', function(done) {
    var stream = pseudoconcat('file.js');
    var fakeFile = new gutil.File({
      path: 'file1-path.js'
    });

    var fakeFile2 = new gutil.File({
      path: 'file2-path.js'
    });

    stream.on('data', function(newFile) {
      assert.equal('document.write(\'<script src="file1-path.js"></script><script src="file2-path.js"></script>\');', newFile.contents);
    });

    stream.on('end', function() {
      done();
    });

    stream.write(fakeFile);
    stream.write(fakeFile2);
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
});
