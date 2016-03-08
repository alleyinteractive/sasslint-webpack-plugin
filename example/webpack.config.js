var path = require('path');
var sassLintPlugin = require(path.join(__dirname, '..'));

module.exports = {
  entry: './entry.js',
  context: './',

  output: {
    path: path.join(__dirname, 'out'),
    filename: 'bundle.js'
  },

  plugins: [
    new sassLintPlugin({
      context: ['./', './../test/testfiles/test2/'],
      ignoreFiles: ['./_test.scss']
    }),
  ],

  module: {
    loaders: [
      {
        test: /\.s[a|c]ss$/,
        loader: 'style!css!sass'
      }
    ]
  }
}
