# sasslint-loader

> sasslint loader for webpack

**Note** This loader is under development and does not yet provide line numbers for errors and warnings in SCSS/SASS source files.

## Install

```console
$ npm install sasslint-loader
```

## Usage

In your webpack configuration

```js
module.exports = {
  // ...
  module: {
    loaders: {
      {
        test: /\s[a|c]ss$/,
        exclude: /node_modules/,
        loader: 'sasslint'
      }
    }
  }
  // ...
}
```

To avoid issues with processing order, it's preferrable to use the `preLoaders` module property, so your files get linted before any other loaders are applied.

```js
module.exports = {
  // ...
  module: {
    preLoaders: {
      {
        test: /\s[a|c]ss$/,
        exclude: /node_modules/,
        loader: 'sasslint'
      }
    }
  }
  // ...
}
```

### Options

You can pass a [sasslint options](https://github.com/sasstools/sass-lint/blob/develop/docs/sass-lint.yml) yml file directly by adding a `sasslint` entry in your webpack config for global options:

```js
module.exports = {
  sasslint: {
    configFile: 'path/.sass-lint.yml'
  }
}
```

#### Errors and Warnings

**By default the loader will auto adjust error reporting depending on sasslint error/warning counts.**
You can still force this behavior by using `emitError` **or** `emitWarning` options:

##### `emitError` (default: `false`)

Loader will always return errors if this option is set to `true`.

```js
module.exports = {
  entry: '...',
  module: {
    // ...
  },
  sasslint: {
    emitError: true
  }
}
```

##### `emitWarning` (default: `false`)

Loader will always return warnings if this option is set to `true`.

##### `quiet` (default: `false`)

Loader will process and report errors only and ignore warnings if this option is set to `true`.

```js
module.exports = {
  entry: '...',
  module: {
    // ...
  },
  sasslint: {
    quiet: true
  }
}
```

##### `failOnWarning` (default: `false`)

Loader will cause the module build to fail if there are any sasslint warnings.

```js
module.exports = {
  entry: '...',
  module: {
    // ...
  },
  sasslint: {
    failOnWarning: true
  }
}
```

##### `failOnError` (default: `false`)

Loader will cause the module build to fail if there are any sasslint errors.

```js
module.exports = {
  entry: '...',
  module: {
    // ...
  },
  sasslint: {
    failOnError: true
  }
}
```

## Gotchas

### ExtractTextPlugin
`ExtractTextPlugin` will run the loaders a second time, and you will see duplicate logs. To
disable this behavior, hide stats for child plugins.

```js
module.exports = {
  entry: '...',
  module: {
    // ...
  },
  stats: {
    children: false
  }
}
```

### NoErrorsPlugin

`NoErrorsPlugin` prevents Webpack from outputting anything into a bundle. So even sass-lint warnings
will fail the build. No matter what error settings are used for `sasslint-loader`.

So if you want to see sass-lint warnings in console during development using `WebpackDevServer`
remove `NoErrorsPlugin` from webpack config.

## [License](LICENSE)
