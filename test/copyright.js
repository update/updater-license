'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var year = require('year')();
var copyright = require('update-copyright');

var fixtures = path.resolve.bind(path, __dirname, 'fixtures');
var expected = path.resolve.bind(path, __dirname, 'expected');
function read(fp) {
  return fs.readFileSync(path.resolve(__dirname, fp), 'utf8');
}

describe('update', function() {
  it('should update a copyright statement:', function() {
    assert.equal(copyright('Copyright (c) 2014, Jon Schlinkert.'), 'Copyright (c) 2014, ' + year + ', Jon Schlinkert.');
    assert.equal(copyright('Copyright (c) ' + (year - 1) + ', Jon Schlinkert.'), 'Copyright (c) ' + (year - 1) + '-' + year + ', Jon Schlinkert.');
  });

  it('should add a copyright symbol if missing:', function() {
    assert.equal(copyright('Copyright 2014, Jon Schlinkert.'), 'Copyright © 2014, ' + year + ', Jon Schlinkert.');
    assert.equal(copyright('Copyright ' + (year - 1) + ', Jon Schlinkert.'), 'Copyright © ' + (year - 1) + '-' + year + ', Jon Schlinkert.');
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
