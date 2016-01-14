/**
 * Webpack doesn't actually have knowledge of SCSS imports,
 * sass-loader manually adds these in to webpack's watcher,
 * we are taking their function from here:
 * https://github.com/jtangelder/sass-loader/blob/master/index.js#L325-L368
 * and modifying it to find imports for us.
 *
 * @param {Object} webpack webpack instance
 */
function getImportsToResolve(webpack) {
  console.log(webpack.resourcePath);
  console.log(webpack.context);
}