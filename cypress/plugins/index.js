const { startDevServer } = require('@cypress/webpack-dev-server')
const findReactScriptsWebpackConfig = require('@cypress/react/plugins/react-scripts/findReactScriptsWebpackConfig')
const browserify = require('@cypress/browserify-preprocessor')

module.exports = (on, config) => {
  // tell Cypress to use .babelrc when bundling spec code
  const options = browserify.defaultOptions
  options.browserifyOptions.transform[1][1].babelrc = true
  on('file:preprocessor', browserify(options))
}
