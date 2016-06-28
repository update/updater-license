'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('delete', 'del');
require('engine', 'Engine');
require('extend-shallow', 'extend');
require('through2', 'through');
require('update-copyright', 'copyright');
require('year');
require = fn;

/**
 * Expose `utils` modules
 */

module.exports = utils;
