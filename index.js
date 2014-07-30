var Buffer = require('buffer').Buffer;
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var path = require('path');
var through = require('through');

var URL_SEPARATOR = '/';

module.exports = function(fileName, opt, remoteFiles) {  
  remoteFiles = remoteFiles || [];

  if (!fileName)
    throw new PluginError('gulp-pseudoconcat-js', 'Missing fileName option for gulp-pseudoconcat-js');

  if (!opt)
    opt = {};

  if (typeof opt.webRoot !== 'string') {
    opt.webRoot = process.cwd();
  } else {
    opt.webRoot = path.resolve(process.cwd(), opt.webRoot);
  }

  var buffer = [];
  var firstFile = null;

  function bufferContents(file) {
    if (file.isNull()) {
      return;
    }

    if (file.isStream()) {
      return this.emit('error', new PluginError('gulp-pseudoconcat-js', 'Streaming not supported'));
    }

    if (!firstFile)
      firstFile = file;
    buffer.push(file);
  }

  function endStream() {
    if (buffer.length === 0)
      return this.emit('end');

    var remoteScripts = remoteFiles.map(function(filePath) {
      return '<script src="' + filePath + '"></script>';
    });
    var scripts = buffer.map(function(file) {
      var scriptPath = path.relative(opt.webRoot, file.path);
      if (path.sep !== URL_SEPARATOR) {
        scriptPath = scriptPath.split(path.sep).join(URL_SEPARATOR);
      }
      return '<script src="' + scriptPath + '"></script>';
    });

    var joinedContents = new Buffer('document.write(\'' + remoteScripts.join('') + scripts.join('') + '\');', 'utf-8');

    var joinedPath = path.join(firstFile.base, fileName);

    var joinedFile = new File({
      cwd: firstFile.cwd,
      base: firstFile.base,
      path: joinedPath,
      contents: joinedContents
    });

    this.emit('data', joinedFile);
    this.emit('end');
  }

  return through(bufferContents, endStream);
};