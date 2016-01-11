var path = require('path');

module.exports = {
  entry: './entry.js',

  output: {
    path: path.join(__dirname, 'out'),
    filename: 'bundle.js'
  },

  sasslint: {
    configFile: '.sass-lint.yml'
  },

  module: {
    preLoaders: [
      {
        test: /\.scss$/,
        loader: path.join(__dirname, '..')
      }
    ],
    loaders: [
      {
        test: /\.s[a|c]ss$/,
        loader: 'style!css!sass'
      }
    ]
  }
}
