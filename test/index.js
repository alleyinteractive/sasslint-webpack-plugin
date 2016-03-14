/* global __dirname, describe, it */
var expect = require('chai').expect;
var assign = require('object-assign');
var webpack = require('webpack');
var MemoryFileSystem = require('memory-fs');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

// _dirname is the test directory
var sassLintPlugin = require(path.join(__dirname, '../index'));

var outputFileSystem = new MemoryFileSystem();

var baseConfig = {
  debug: false,
  output: {
    path: path.join(__dirname, 'output')
  },
  plugins: [
    new sassLintPlugin(),
  ]
};

/**
 * This is the basic in-memory compiler
 */
function pack(testConfig, callback) {
  var compiler = webpack(testConfig);
  compiler.outputFileSystem = outputFileSystem;
  compiler.run(callback);
}


/**
 * Test Suite
 */
describe('sasslint-loader', function () {
  it('works with a simple file', function (done) {
    var config = {
      context: './test/testfiles/test1',
      entry: './index'
    };

    pack(assign({}, baseConfig, config), function (err, stats) {
      expect(err).to.not.exist;
      expect(stats.compilation.errors.length).to.equal(0);
      expect(stats.compilation.warnings.length).to.equal(0);
      done(err);
    });
  });

  it('sends warnings properly', function (done) {
    var config = {
      context: './test/testfiles/test2',
      entry: './index'
    };

    pack(assign({}, baseConfig, config), function (err, stats) {
      expect(err).to.not.exist;
      expect(stats.compilation.errors.length).to.equal(0);
      expect(stats.compilation.warnings.length).to.equal(1);
      done(err);
    });
  });

  it('fails on warnings', function (done) {
    var config = {
      context: './test/testfiles/test2',
      entry: './index',
      plugins: [ new sassLintPlugin({
        failOnWarning: true
      })]
    };

    expect(function() {
      var compiler = webpack(assign({}, baseConfig, config));
      compiler.outputFileSystem = outputFileSystem;
      compiler.run();
    }).to.throw('Failed because of a sasslint warning.\n');
    done()
  });

  it('sends errors properly', function (done) {
    var config = {
      context: './test/testfiles/test3',
      entry: './index',
      plugins: [ new sassLintPlugin({
        configFile: path.join(__dirname, './.sass-lint.yml')
      })]
    };

    pack(assign({}, baseConfig, config), function (err, stats) {
      expect(err).to.not.exist;
      expect(stats.compilation.errors.length).to.equal(1);
      expect(stats.compilation.warnings.length).to.equal(0);
      done(err);
    });
  });

  it('fails on errors', function (done) {
    var config = {
      context: './test/testfiles/test3',
      entry: './index',
      plugins: [ new sassLintPlugin({
        configFile: path.join(__dirname, './.sass-lint.yml'),
        failOnError: true
      })]
    };

    expect(function() {
      var compiler = webpack(assign({}, baseConfig, config));
      compiler.outputFileSystem = outputFileSystem;
      compiler.run();
    }).to.throw('Failed because of a sasslint error.\n');
    done()
  });
  it('can specify a YAML config file via config', function (done) {
    var config = {
      context: './test/testfiles/test5',
      entry: './index',
      plugins: [ new sassLintPlugin({
        configFile: path.join(__dirname, './.sass-lint.yml')
      })]
    };

    pack(assign({}, baseConfig, config), function (err, stats) {
      expect(err).to.not.exist;
      expect(stats.compilation.errors.length).to.equal(0);
      expect(stats.compilation.warnings.length).to.equal(0);
      done(err);
    });
  });

  it('should work with multiple files', function(done) {
    var config = {
      context: './test/testfiles/test7',
      entry: './index'
    };

    pack(assign({}, baseConfig, config), function (err, stats) {
      expect(err).to.not.exist;
      expect(stats.compilation.errors.length).to.equal(0);
      expect(stats.compilation.warnings.length).not.to.equal(0);
      done(err);
    });
  });

  it('should work with multiple context', function(done) {
    var config = {
      context: './test/testfiles/test5',
      entry: './index',
      plugins: [ new sassLintPlugin({
        context: ['./test/testFiles/test5', './test/testFiles/test7']
      })]
    };

    pack(assign({}, baseConfig, config), function (err, stats) {
      expect(err).to.not.exist;
      expect(stats.compilation.errors.length).to.equal(0);
      expect(stats.compilation.warnings.length).not.to.equal(0);
      done(err);
    });
  });

  it('should allow ignoring files', function(done) {
    var config = {
      context: './test/testfiles/test7',
      entry: './index',
      plugins: [ new sassLintPlugin({
        ignoreFiles: ['./test/testfiles/test7/_second.scss']
      })]
    };

    pack(assign({}, baseConfig, config), function (err, stats) {
      expect(err).to.not.exist;
      expect(stats.compilation.errors.length).to.equal(0);
      expect(stats.compilation.warnings.length).to.equal(0);
      done(err);
    });
  });
});