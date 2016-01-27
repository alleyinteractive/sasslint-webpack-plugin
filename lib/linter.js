// Dependencies
var chalk = require('chalk');
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
  var report = sassLint.lintFiles(input, {}, options.configFile);

  var errorCount = 0,
    warningCount = 0;

  if (report.length) {
    report.forEach(function(file) {
      if (file.warningCount && options.quiet) {
        file.warningCount = 0;
        file.messages = report.messages
          .filter(function(message) {
            return message.severity !== 1;
          });
      }

      errorCount += file.errorCount || 0;
      warningCount += file.warningCount || 0;

      if (file.errorCount || file.warningCount) {
        console.log(formatter(file.messages, file.filePath));
      }
    });
  }

  if (options.failOnError && errorCount) {
    throw new Error('Failed because of a sasslint error.\n');
  } else if (options.failOnWarning && warningCount) {
    throw new Error('Failed because of a sasslint warning.\n');
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
module.exports = function(input, options, callback) {
  lint(input, options, (callback));
}