// Dependencies
var loaderUtils = require('loader-utils');
var assign = require('object-assign');

// Modules
var lintIter = require('./lib/linter');

/**
 * Webpack Loader
 *
 * @param {String|Buffer} input JavaScript string
 * @returns {String|Buffer} original input
 */
module.exports = function(input) {
  var options = assign(
    {
      configFile: '.scss-lint.yml'
    },
    // User defaults
    this.options.sasslint || {},
    // loader query string
    loaderUtils.parseQuery(this.query)
  );

  this.cacheable();

  var callback = this.async();

  if (!callback) { // sync
    lintIter(input, options, this);
    return input;
  } else { // async
    try {
      lintIter(input, options, this, callback);
    } catch(e) {
      callback(e);
    }
  }
};
