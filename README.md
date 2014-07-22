[![Build Status](https://travis-ci.org/MilanLempera/gulp-pseudoconcat-js.svg?branch=master)](https://travis-ci.org/MilanLempera/gulp-pseudoconcat-js)

## Information

<table>
<tr> 
<td>Package</td><td>gulp-pseudoconcat-js</td>
</tr>
<tr>
<td>Description</td>
<td>Transform javascript files into &lt;script&gt; includes</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.10</td>
</tr>
</table>

gulp-pseudoconcat-js is substitute for [gulp-concat][1] for development. With this plugin browser use js files directly from src folder without any copying to build directory, source maps,... 

Gulp-pseudoconcat-js lets you simply debug your javascripts in your IDE.

Order of the files in ouptut script is same as order of the input. So you can use the plugin with [gulp-angular-filesort][2] and similar sorting plugins.

## Install

Install with [npm](https://npmjs.org/package/gulp-pseudoconcat-js)

```
npm install --save-dev gulp-pseudoconcat-js
```

## Basic Usage

```javascript
var pseudoconcatJs = require('gulp-pseudoconcat-js');

gulp.task('scripts', function() {
  gulp.src(['src/file1.js', 'src/file2.js'])
    .pipe(pseudoconcatJs('all.js'))
    .pipe(gulp.dest('./'))
});
```

```javascript
// all.js content
document.write('<script src="src/file1.js"></script><script src="src/file2.js"></script>');
```

## API

### pseudoconcatJs(filename [, options])

`filename` (string)

 - output file name 

`options` (object)

 - options object

#### options

`webRoot` (string), default gulp working directory

 - directory from which the file path derived 
 - typically the directory that contains index.html

```
without options.webRoot
    project/src/frontend/first.js => <script src="project/src/frontend/first.js">
    
options.webRoot = project/src/
    project/src/frontend/first.js => <script src="frontend/first.js">
```


## Typicaly Usage

```javascript
var angularFilesort = require('gulp-angular-filesort');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var ngmin = require('gulp-ngmin');
var pseudoconcatJs = require('gulp-pseudoconcat-js');

  gulp.src('src/app/**/*.js')
    .pipe(angularFilesort())
    .pipe(ngmin())
    .pipe(gulpif(config.isProduction,
      concat('scripts.js'),
      pseudoconcatJs('scripts.js', {webRoot: 'src/'})
      ))
    .pipe(gulp.dest('src/'));
```

## LICENSE

(MIT License)

Copyright (c) 2014 Milan Lempera <milanlempera@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


  [1]: https://www.npmjs.org/package/gulp-concat
  [2]: https://www.npmjs.org/package/gulp-angular-filesort