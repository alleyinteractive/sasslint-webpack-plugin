var path = require('path');
var sassLintPlugin = require(path.join(__dirname, '..'));

module.exports = {
  entry: './entry.js',

  output: {
    path: path.join(__dirname, 'out'),
    filename: 'bundle.js'
  },

  plugins: [
    new sassLintPlugin({ failOnWarning: true }),
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
