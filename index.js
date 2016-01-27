// Dependencies
var loaderUtils = require('loader-utils');
var assign = require('object-assign');

// Modules
var linter = require('./lib/linter');

function apply(options, compiler, callback) {
  // acces to compiler and options
  linter(compiler.context + options.glob, options, callback);
}

module.exports = function(options, callback) {
  options = options || {};
  options.glob = options.glob || '**/*.s?(c|a)ss';

  if (options instanceof Array) {
    options = {
      include: options,
    };
  }

  if (!Array.isArray(options.include)) {
    options.include = [options.include];
  }

  return {
    apply: apply.bind(this, options)
  };
};