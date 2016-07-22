'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var copyright = require('update-copyright');
var license = require('..');
var orig = process.cwd();

var fixtures = path.resolve.bind(path, __dirname, 'fixtures');
var expected = path.resolve.bind(path, __dirname, 'expected');
function read(fp) {
  return fs.readFileSync(path.resolve(__dirname, fp), 'utf8');
}

describe('update', function() {
  it('should update a copyright statement:', function() {
    assert.equal(copyright('Copyright (c) 2014, Jon Schlinkert.'), 'Copyright (c) 2014, 2016, Jon Schlinkert.');
    assert.equal(copyright('Copyright (c) 2015, Jon Schlinkert.'), 'Copyright (c) 2015-2016, Jon Schlinkert.');
  });

  it('should add a copyright symbol if missing:', function() {
    assert.equal(copyright('Copyright 2014, Jon Schlinkert.'), 'Copyright © 2014, 2016, Jon Schlinkert.');
    assert.equal(copyright('Copyright 2015, Jon Schlinkert.'), 'Copyright © 2015-2016, Jon Schlinkert.');
  });

  it.skip('should use a template to update the license:', function() {
    var tmpl = read(fixtures('mit.tmpl'));
    var aa = copyright(fixtures('LICENSE-A'), {template: tmpl});
    assert(aa, expected('LICENSE-A'));

    var ba = copyright(fixtures('LICENSE-B'), {template: tmpl});
    assert(ba, expected('LICENSE-B'));

    var ca = copyright(fixtures('LICENSE-C'), {template: tmpl});
    assert(ca, expected('LICENSE-C'));
  });

  it.skip('should fix the lead in a MIT license:', function() {
    var tmpl = read(fixtures('mit.tmpl'));
    var da = copyright(fixtures('LICENSE-D'), {template: tmpl});
    assert(da, expected('LICENSE-D'));
  });
});
