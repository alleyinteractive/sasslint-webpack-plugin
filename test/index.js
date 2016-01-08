/* global __dirname, describe, it */
var expect = require('chai').expect;
var assign = require('object-assign');
var webpack = require('webpack');
var MemoryFileSystem = require('memory-fs');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');

// _dirname is the test directory
var sasslintLoader = path.join(__dirname, '../index');
var outputFileSystem = new MemoryFileSystem();

var baseConfig = {
  debug: false,
  output: {
    path: path.join(__dirname, 'output')
  },
  module: {
    preLoaders: [
      { test: /\.scss$/, loader: sasslintLoader }
    ],
    loaders: [
      { test: /\.scss$/, loader: 'file' }
    ]
  },
  sasslint: {
    displayOutput: false,
    ignoreCache: true
  }
};

var extractConfig = {
  debug: true,
  output: {
    path: path.join(__dirname, 'output')
  },
  module: {
    preLoaders: [
      { test: /\.(sass|scss)$/, loader: sasslintLoader }
    ],
    loaders: [
      { test: /\.(sass|scss)$/, loader: ExtractTextPlugin.extract('style', 'css?sourceMap!sass?sourceMap') }
    ]
  },
  sasslint: {
    displayOutput: true
  },
  plugins: [
    new ExtractTextPlugin(path.join(__dirname, 'output/bundle.css'))
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
      entry: './test/testfiles/test1'
    };

    // Test 1 is a perfectly valid sass file
    pack(assign({}, baseConfig, config), function (err, stats) {
      expect(err).to.not.exist;
      expect(stats.compilation.errors.length).to.equal(0);
      expect(stats.compilation.warnings.length).to.equal(0);
      done(err);
    });
  });

  it('sends warnings properly', function (done) {
    var config = {
      entry: './test/testfiles/test2'
    };

    // Test 2 should produce a warning because of the default settings
    pack(assign({}, baseConfig, config), function (err, stats) {
      expect(err).to.not.exist;
      expect(stats.compilation.errors.length).to.equal(0);
      expect(stats.compilation.warnings.length).to.equal(1);
      done(err);
    });
  });

  it('sends errors properly', function (done) {
    var config = {
      entry: './test/testfiles/test3'
    };

    // Test 3 should produce an error for the font-size units
    pack(assign({}, baseConfig, config), function (err, stats) {
      expect(err).to.not.exist;
      expect(stats.compilation.errors.length).to.equal(1);
      expect(stats.compilation.warnings.length).to.equal(0);
      done(err);
    });
  });

  it('can specify a rule via config', function (done) {
    var config = {
      entry: './test/testfiles/test4',
      sasslint: {
        rules: {
          'property-units': [ 2, { global: [ 'px' ] } ]
        }
      }
    };

    // Test 4 (which is identical) should now pass
    pack(assign({}, baseConfig, config), function (err, stats) {
      expect(err).to.not.exist;
      expect(stats.compilation.errors.length).to.equal(0);
      expect(stats.compilation.warnings.length).to.equal(0);
      done(err);
    });
  });

  it('can specify a YAML config file via config', function (done) {
    var config = {
      entry: './test/testfiles/test5',
      sasslint: {
        configFile: path.join(__dirname, './testfiles/.sass-lint.yml')
      }
    };

    // Test 3 should now pass
    pack(assign({}, baseConfig, config), function (err, stats) {
      expect(err).to.not.exist;
      expect(stats.compilation.errors.length).to.equal(0);
      expect(stats.compilation.warnings.length).to.equal(0);
      done(err);
    });
  });

  it('should only report once when using ExtractText', function (done) {
    var config = {
      entry: './test/testfiles/test6'
    };

    // Test 2 should produce a warning because of the default settings
    pack(assign({}, extractConfig, config), function (err, stats) {
      expect(err).to.not.exist;
      expect(stats.compilation.errors.length).to.equal(0);
      expect(stats.compilation.warnings.length).to.equal(1);
      done(err);
    });
  })
});