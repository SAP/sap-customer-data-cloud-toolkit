/*
 * Copyright: Copyright 2023 SAP SE or an SAP affiliate company and cdc-tools-chrome-extension contributors
 * License: Apache-2.0
 */


const { startDevServer } = require('@cypress/webpack-dev-server')
const findReactScriptsWebpackConfig = require('@cypress/react/plugins/react-scripts/findReactScriptsWebpackConfig')
const browserify = require('@cypress/browserify-preprocessor')
const extensionLoader = require('cypress-browser-extension-plugin/loader')

module.exports = (on, config) => {
  const options = browserify.defaultOptions
  options.browserifyOptions.transform[1][1].babelrc = true

  on('file:preprocessor', browserify(options))
}
