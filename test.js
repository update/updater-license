/*!
 * updater-license <https://github.com/jonschlinkert/updater-license>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var copyright = require('update-copyright');
var license = require('./');
var orig = process.cwd();

function read(fp) {
  return fs.readFileSync(fp, 'utf8');
}
function fixture(fp) {
  return read(path.join('fixtures', fp));
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

  it('should use a template to update the license:', function() {
    var tmpl = read('templates/mit.tmpl');
    var aa = copyright(fixture('LICENSE-A'), {template: tmpl});
    var ab = fixture('LICENSE-A-expected');
    assert(aa, ab);

    var ba = copyright(fixture('LICENSE-B'), {template: tmpl});
    var bb = fixture('LICENSE-B-expected');
    assert(ba, bb);

    var ca = copyright(fixture('LICENSE-C'), {template: tmpl});
    var cb = fixture('LICENSE-C-expected');
    assert(ca, cb);
  });

  it('should fix the lead in a MIT license:', function() {
    var tmpl = read('templates/mit.tmpl');
    var da = copyright(fixture('LICENSE-D'), {template: tmpl});
    var db = fixture('LICENSE-D-expected');
    assert(da, db);
  });
});
