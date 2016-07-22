'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var update = require('update');
var npm = require('npm-install-global');
var del = require('delete');
var updater = require('..');
var app;

var fixtures = path.resolve.bind(path, __dirname, 'fixtures');
var actual = path.resolve.bind(path, __dirname, 'actual');

function exists(name, cb) {
  return function(err) {
    if (err) return cb(err);
    var filepath = actual(name);
    fs.stat(filepath, function(err, stat) {
      if (err) return cb(err);
      assert(stat);
      del(filepath, cb);
    });
  };
}

describe('updater-license', function() {
  if (!process.env.CI && !process.env.TRAVIS) {
    before(function(cb) {
      npm.maybeInstall('update', cb);
    });
  }

  beforeEach(function() {
    app = update({silent: true});
    app.option('srcBase', fixtures());
    app.cwd = actual();
  });

  describe('plugin', function() {
    it('should only register the plugin once', function(cb) {
      var count = 0;
      app.on('plugin', function(name) {
        if (name === 'updater-license') {
          count++;
        }
      });
      app.use(updater);
      app.use(updater);
      app.use(updater);
      assert.equal(count, 1);
      cb();
    });

    it('should extend tasks onto the instance', function() {
      app.use(updater);
      assert(app.tasks.hasOwnProperty('default'));
      assert(app.tasks.hasOwnProperty('license'));
    });

    it('should run the `default` task with .build', function(cb) {
      app.use(updater);
      app.build('default', exists('LICENSE', cb));
    });

    it('should run the `default` task with .update', function(cb) {
      app.use(updater);
      app.update('default', exists('LICENSE', cb));
    });

    it('should run the `license` task with .build', function(cb) {
      app.use(updater);
      app.build('license', exists('LICENSE', cb));
    });

    it('should run the `license` task with .update', function(cb) {
      app.use(updater);
      app.update('license', exists('LICENSE', cb));
    });
  });

  if (!process.env.CI && !process.env.TRAVIS) {
    describe('updater (CLI)', function() {
      it('should run the default task using the `updater-license` name', function(cb) {
        app.use(updater);
        app.update('updater-license', exists('LICENSE', cb));
      });

      it('should run the default task using the `license` updater alias', function(cb) {
        app.use(updater);
        app.update('license', exists('LICENSE', cb));
      });
    });
  }

  describe('updater (API)', function() {
    it('should run the default task on the updater', function(cb) {
      app.register('license', updater);
      app.update('license', exists('LICENSE', cb));
    });

    it('should run the `license` task', function(cb) {
      app.register('license', updater);
      app.update('license:license', exists('LICENSE', cb));
    });

    it('should run the `default` task when defined explicitly', function(cb) {
      app.register('license', updater);
      app.update('license:default', exists('LICENSE', cb));
    });
  });

  describe('sub-updater', function() {
    it('should work as a sub-updater', function(cb) {
      app.register('foo', function(foo) {
        foo.register('license', updater);
      });
      app.update('foo.license', exists('LICENSE', cb));
    });

    it('should run the `default` task by default', function(cb) {
      app.register('foo', function(foo) {
        foo.register('license', updater);
      });
      app.update('foo.license', exists('LICENSE', cb));
    });

    it('should run the `license:default` task when defined explicitly', function(cb) {
      app.register('foo', function(foo) {
        foo.register('license', updater);
      });
      app.update('foo.license:default', exists('LICENSE', cb));
    });

    it('should run the `license:license` task', function(cb) {
      app.register('foo', function(foo) {
        foo.register('license', updater);
      });
      app.update('foo.license:license', exists('LICENSE', cb));
    });

    it('should work with nested sub-updaters', function(cb) {
      app
        .register('foo', updater)
        .register('bar', updater)
        .register('baz', updater);
      app.update('foo.bar.baz', exists('LICENSE', cb));
    });
  });
});
