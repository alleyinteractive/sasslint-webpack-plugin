// Dependencies
var loaderUtils = require('loader-utils');
var assign = require('object-assign');

// Modules
var linter = require('./lib/linter');

function apply(options, compiler) {
  // acces to compiler and options
  compiler.plugin('compilation', function(compilation, params) {
    // Avoid redundant lint when it is run in plugin like extract-text-webpack-plugin.
    if(options.ignorePlugins.indexOf(compilation.name) >= 0) {
      return;
    }
    // Linter returns a simple report of FilePath + Warning or Errors
    var contexts = options.context || [compiler.context];
    var report = [];
    contexts.forEach(function(context) {
      report = report.concat(linter(context + '/' + options.glob, options));
    });

    // Hook into the compilation as early as possible, at the seal step
    compilation.plugin('seal', function() {
      // We need to keep the reference to the compilation's scope
      var _this = this;

      // Errors/Warnings are pushed to the compilation's error handling
      // so we can drop out of the processing tree on warn/error
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

// converts options specified as a string to Array
function parseArrayTypeOptions(options, optionNames) {
  optionNames.forEach(function(optionName) {
    if (typeof options[optionName] === 'string') {
      options[optionName] = [options[optionName]];
    }
  });
}

// makes it easier to pass and check options to the plugin thank you webpack doc
// [https://webpack.github.io/docs/plugins.html#the-compiler-instance]
module.exports = function(options) {
  options = options || {};
  // Default Glob is any directory level of scss and/or sass file,
  // under webpack's context and specificity changed via globbing patterns
  options.glob = options.glob || '**/*.s?(c|a)ss';

  parseArrayTypeOptions(options, [
    'ignoreFiles',
    'ignorePlugins',
    'context'
  ]);

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