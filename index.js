'use strict';

var fs = require('fs');
var path = require('path');
var dir = path.resolve.bind(path, __dirname, 'templates');
var utils = require('./utils');

module.exports = function(app, base, env) {

  /**
   * Delete the existing `LICENSE` or `LICENSE-MIT` file in the current working directory.
   * This task is also aliased as `license:license-del` to free up the `new` task name in case
   * you use this generator as a [plugin](#api).
   *
   * ```sh
   * $ update license:del
   * ```
   * @name license:del
   * @api public
   */

  app.task('del', ['license-del']);
  app.task('license-del', function(cb) {
    utils.del(['LICENSE', 'LICENSE-MIT'], done(app, cb));
  });

  /**
   * Create a new `LICENSE` file in the current working directory from the [mit template](templates/license-mit.tmpl). _(This task is also aliased as `license:license-new` to free up the `new` task
   * name in case you use this generator as a [plugin](#api))_.
   *
   * ```sh
   * $ update license:new
   * ```
   * @name license:new
   * @api public
   */

  app.task('new', ['license-new']);
  app.task('license-new', function(cb) {
    app.generate('license:default', cb);
  });

  /**
   * Create a new `LICENSE` file in the current working directory from the [mit template](templates/license-mit.tmpl). _(This task is also aliased as `license:license-new` to free up the `new` task
   * name in case you use this generator as a [plugin](#api))_.
   *
   * ```sh
   * $ update license:udpate
   * ```
   * @name license:udpate
   * @api public
   */

  app.task('update', {silent: true}, ['license-update']);
  app.task('license-update', {silent: true}, function(cb) {
    return app.src('LICENSE*')
      .pipe(utils.through.obj(function(file, enc, next) {
        if (hasYear(file.contents.toString()) && file.basename === 'LICENSE') {
          next(null, file);
          return;
        }

        var template = fs.readFileSync(dir('license-mit.tmpl'), 'utf8');
        var context = utils.copyright.parse(utils.copyright(file.contents.toString()));
        var engine = new utils.Engine();
        var filepath = file.path;
        file.contents = new Buffer(engine.render(template, context[0]));
        file.basename = 'LICENSE';
        utils.del(filepath, function(err) {
          if (err) return next(err);
          next(null, file);
        });
      }))
      .pipe(app.dest(app.cwd));
  });

  /**
   * Alias `license` task to make the updater more shareable
   */

  app.task('default', {silent: true}, ['license-update']);
};

function hasYear(str) {
  return str.indexOf(utils.year()) !== -1;
}

function done(app, cb) {
  return function(err, files) {
    if (err) return cb(err);
    if (files.length && app.options.verbose) {
      console.log('deleted', files.join(', '));
    }
    cb();
  };
}
