**NOTE**
Due to how non-js files are handled via webpack, this has had to switch to a plugin instead of a loader.
Please be aware that this will break current installs, it is a simple change from the loader to a plugin although.

# Sasslint Plugin

> Ssasslint plugin for Webpack

## Install

```console
$ npm install sasslint-loader
```

## Usage

In your webpack configuration

```js
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
* `glob`: Change the glob pattern for finding files. Default: (`**/*.s?(a|c)ss`)
* `quite`: Suppress warnings, errors will still show. Default: `false`
* `failOnWarning`: Have Webpack's build process die on warning. Default: `false`
* `failOnError`: Have Webpack's build process die on error. Default: `false`

```js
// Default settings
module.exports = {
  plugins: [
    new sassLintPlugin({
      configFile: '.sass-lint.yml',
      glob: '**/*.s?(a|c)ss',
      quite: false,
      failOnWarning: false,
      failOnError: false
    }),
  ]
}
```

#### Errors and Warnings

The plugin will dump full reporting of, errors and warnings.
You can use the `quite` option to hide files which only have warnings.
`quite` will not hide errors, nor will it hide warnings on files with errors.


### NoErrorsPlugin

`NoErrorsPlugin` prevents Webpack from outputting anything into a bundle. So even sass-lint warnings
will fail the build. No matter what error settings are used for `sasslint-loader`.

So if you want to see sass-lint warnings in console during development using `WebpackDevServer`
remove `NoErrorsPlugin` from webpack config.

#### [License](LICENSE)
