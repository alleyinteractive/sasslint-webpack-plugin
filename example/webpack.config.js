var path = require('path');
var sassLintPlugin = require(path.join(__dirname, '..'));
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './example/entry.js',

  output: {
    path: path.join(__dirname, 'out'),
    filename: 'bundle.js'
  },

  plugins: [
    new sassLintPlugin({
      context: ['./example', './example/../test/testfiles/test2/'],
      ignorePlugins: ['extract-text-webpack-plugin'],
      ignoreFiles: ['./example/_test.scss']
    }),
    new ExtractTextPlugin('styles.css')
  ],

  module: {
    loaders: [
      {
        test: /\.s[a|c]ss$/,
        loader: ExtractTextPlugin.extract('style-loader', '!css!sass')
      }
    ]
  }
}
