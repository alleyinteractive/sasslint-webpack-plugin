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
function lint(input, options) {
  // Run sassLint
  var report = sassLint.lintFiles(input, {}, options.configFile);

  var fileReport = [];

  if (report.length) {
    report.forEach(function(file) {

      if (file.warningCount && options.quiet) {
        file.warningCount = 0;
        file.messages = report.messages
          .filter(function(message) {
            return message.severity !== 1;
          });
      }

      if (file.errorCount || file.warningCount) {
        console.log(formatter(file.messages, file.filePath));
      }

      if (file.errorCount) {
        fileReport.push({
          'error': true,
          'file': file.filePath
        });
      }

      if (file.warningCount) {
        fileReport.push({
          'error': false,
          'file': file.filePath
        });
      }
    });
  }

  if (options.failOnError && file.errorCount) {
    throw new Error('Failed because of a sasslint error.\n');
  } else if (options.failOnWarning && file.warningCount) {
    throw new Error('Failed because of a sasslint warning.\n');
  }

  return fileReport;
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
module.exports = lint;