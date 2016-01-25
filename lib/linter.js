// Dependencies
var sassLint = require('sass-lint');
var path = require('path');

// Helper Utils
var formatter = require('./formatter');

/**
 * Linter
 *
 * @param {String|Buffer} input Javascript string
 * @param {Object} config scsslint configuration
 * @param {Object} webpack webpack instance
 * @param {Function} callback optional callback for async loader
 * @return {void}
 */
function lint(input, options, webpack, callback) {
  // Run sassLint
  var report = sassLint.lintText({
    'text': input,
    'format': path.extname(webpack.resourcePath).replace('.',  ''),
    'filename': path.relative(process.cwd(), webpack.resourcePath)
  }, {}, options.configFile);

  if (report.messages.length) {
    if (report.warningCount && options.quiet) {
      report.warningCount = 0;
      report.messages = report.messages
        .filter(function(message) {
          return message.severity !== 1;
        });
    }

    if (report.errorCount || report.warningCount) {
      var messages = formatter(report.messages, webpack.resourcePath);

      // Default emitter behavior
      var emitter = report.errorCount ? webpack.emitError : webpack.emitWarning;

      // Force emitError or emitWarning by setting option
      if (options.emitError) {
        emitter = webpack.emitError;
      } else if (options.emitWarning) {
        emitter = webpack.emitWarning;
      }

      if (emitter) {
        emitter(messages);
        if (options.failOnError && report.errorCount) {
          throw new Error('Module failed because of a sasslint error.\n' + messages);
        } else if (options.failOnWarning && report.warningCount) {
          throw new Error('Module failed because of a sasslint warning.\n' + messages);
        }
      } else {
        throw new Error(
          'Your module system doesn\'t support emitWarning.' +
          'Update available? \n' +
          messages
        );
      }
    }
  }

  if (callback) {
    callback(null, input);
  }
}

/**
 * Iternate through files for linter
 *
 * @param {String|Buffer} input Javascript string
 * @param {Object} config scsslint configuration
 * @param {Object} webpack webpack instance
 * @param {Function} callback optional callback for async loader
 * @return {void}
 */
module.exports = function(input, options, webpack, callback) {
  try {
    lint(input, options, webpack, callback);
  } catch(e) {
    callback(e);
  }

  // If directory name is included in the resource path, replace it with .
}