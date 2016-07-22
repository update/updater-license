'use strict';

var ask = require('helper-ask');
var utils = require('./utils');

module.exports = function(app) {
  if (!utils.isValid(app, 'updater-license')) return;

  /**
   * Helper
   */

  app.asyncHelper('ask', ask(app));

  /**
   * Register a generator
   */

  app.register('new', require('generate-license'));

  /**
   * Delete the existing `LICENSE` or `LICENSE-MIT` file in the current working directory.
   * This task is also aliased as `license:license-del` to free up the `del` task name in case
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
    app.generate('new', cb);
  });

  /**
   * Update the MIT `LICENSE` file in the current working directory. Uses the [mit template](templates/license-mit.tmpl) by default.
   *
   * ```sh
   * $ update license
   * ```
   * @name license
   * @api public
   */

  app.task('license', {silent: true}, function(cb) {
    app.create('licenses');
    app.licenses('templates/*.tmpl', {cwd: __dirname});
    return app.src('LICENSE*', {cwd: app.options.srcBase || app.cwd})
      .pipe(matter())
      .pipe(renameFile())
      .pipe(updateLicense(app))
      .pipe(app.dest(app.cwd));
  });

  /**
   * Alias `license` task to make the updater more shareable
   */

  app.task('default', {silent: true}, ['license']);
};

/**
 * Update LICENSE using a template
 */

function updateLicense(app) {
  return utils.through.obj(function(file, enc, next) {
    if (hasYear(file.contents.toString())) {
      next(null, file);
      return;
    }

    var template;
    try {
      var views = app.licenses.views;
      for (var key in views) {
        if (views.hasOwnProperty(key)) {
          var view = views[key];
          rename(view);
          if (view.basename === file.basename) {
            template = view;
            break;
          }
        }
      }

      if (typeof template === 'undefined') {
        next(null, file);
        return;
      }

      var filepath = file.path;
      var context = utils.copyright.parse(utils.copyright(file.contents.toString()));
      var engine = new utils.Engine();
      var str = engine.render(template.content, context[0]);
      file.contents = new Buffer(str);
    } catch (err) {
      next(err);
      return;
    }

    utils.del(filepath, function(err) {
      if (err) return next(err);
      next(null, file);
    });
  });
}

/**
 * Parse front matter
 */

function matter() {
  return utils.through.obj(function(file, enc, next) {
    utils.parser.parse(file, next);
  });
}

/**
 * Rename the vinyl file using properties in front matter
 */

function rename(file) {
  file.data.rename = file.data.rename || {};
  for (var key in file.data.rename) {
    file[key] = file.data.rename[key];
    delete file.data.rename;
  }
}

/**
 * Rename the vinyl file using properties in front matter
 */

function renameFile(file) {
  return utils.through.obj(function(file, enc, next) {
    rename(file);
    next(null, file);
  });
}

/**
 * Utils
 */

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
