// Dependencies
var loaderUtils = require('loader-utils');
var assign = require('object-assign');

// Modules
var linter = require('./lib/linter');

function apply(options, compiler) {
  // acces to compiler and options
  compiler.plugin('compilation', function(c, params) {
    var report = linter(compiler.context + options.glob, options);

    c.plugin('seal', function() {
      var _this = this;
      report.forEach(function(x) {
        if(x.error) {
          _this.errors.push(x.file);
        } else {
          _this.warnings.push(x.file);
        }
      });
    });
  });
}

module.exports = function(options) {
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