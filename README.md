**NOTE**
Due to how non-js files are handled via webpack, this has been forked from sasslint-loader and rewritten as plugin instead of a loader.

# Sasslint Plugin

> Sasslint plugin for Webpack

## Install

```console
$ npm install sasslint-webpack-plugin
```

## Usage

In your webpack configuration

```js
var sassLintPlugin = require('sasslint-webpack-plugin');


module.exports = {
  // ...
  plugins: [
    new sassLintPlugin(),
  ],
  // ...
}
```

### Options

You can customize the lint settings via a `.sass-lint.yml` file. See [sasslint options](https://github.com/sasstools/sass-lint/blob/develop/docs/sass-lint.yml), for complete options.

* `configFile`: You can change the config file location. Default: (`.sass-lint.yml`)
* `context`: Array of strings or String, Change the root of your SCSS files. Defualt inherits from webpack config.
* `ignoreFiles`: Array of files to ignore, must be full path, Default: none
* `glob`: Change the glob pattern for finding files. Default: (`**/*.s?(a|c)ss`)
* `quiet`: Suppress warnings, errors will still show. Default: `false`
* `failOnWarning`: Have Webpack's build process die on warning. Default: `false`
* `failOnError`: Have Webpack's build process die on error. Default: `false`

```js
// Default settings
module.exports = {
  plugins: [
    new sassLintPlugin({
      configFile: '.sass-lint.yml',
      context: ['inherits from webpack'],
      ignoreFiles: [],
      glob: '**/*.s?(a|c)ss',
      quiet: false,
      failOnWarning: false,
      failOnError: false
    }),
  ]
}
```

#### Errors and Warnings

The plugin will dump full reporting of errors and warnings.
You can use the `quiet` option to hide files which only have warnings.
`quiet` will not hide errors, nor will it hide warnings on files with errors.


### NoErrorsPlugin

`NoErrorsPlugin` prevents Webpack from outputting anything into a bundle. So even sass-lint warnings
will fail the build. No matter what error settings are used for `sasslint-webpack-plugin`.

So if you want to see sass-lint warnings in console during development using `WebpackDevServer`
remove `NoErrorsPlugin` from webpack config.

#### [License](LICENSE)
