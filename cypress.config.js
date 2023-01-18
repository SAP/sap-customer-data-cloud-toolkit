const { defineConfig } = require('cypress')
require('dotenv').config()
const path = require('path')
module.exports = defineConfig({
  projectId: '4iymaz',
  env: {
    userName: `${process.env.email}`,
    passWord: `${process.env.passWord}`,
    codeCoverageTasksRegistered: true,
  },

  e2e: {
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        const extensionFolder = path.resolve(__dirname, './build')

        launchOptions.args.push(`--load-extension=${extensionFolder}`)

        return launchOptions
      })
      require('@cypress/code-coverage/task')(on, config)

      on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'))
      return {
        config,

        excludeSpecPattern: ['cypress/e2e/e2eFullTesting.cy.js'],
      }
    },
  },

  component: {
    setupNodeEvents(on, config) {
      console.log('setupNodeEvents for components')

      require('@bahmutov/cypress-code-coverage/plugin')(on, config)

      return config
    },
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',

      webpackConfig: {
        mode: 'development',
        devtool: false,
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env', '@babel/preset-react'],
                  plugins: ['istanbul'],
                },
              },
            },
          ],
        },
      },
    },
  },
})
