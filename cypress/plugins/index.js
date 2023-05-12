/*
 * Copyright (c) 2023 SAP SE or an SAP affiliate company.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of SAP
 * ("Confidential Information"). You shall not disclose such Confidential
 * Information and shall use it only in accordance with the terms of the
 * license agreement you entered into with SAP.
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
