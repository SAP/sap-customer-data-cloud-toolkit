const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: '4iymaz',

  e2e: {
    setupNodeEvents(on, config) {
      require('@cypress/code-coverage/task')(on, config)

      // include any other plugin code...

      // It's IMPORTANT to return the config object
      // with any changed environment variables
      on('file:preprocessor', require('@cypress/code-coverage/use-babelrc'))
      return config
    },
  },

  component: {
    setupNodeEvents(on, config) {
      console.log('setupNodeEvents for components')

      // https://github.com/bahmutov/cypress-code-coverage
      require('@bahmutov/cypress-code-coverage/plugin')(on, config)

      return config
    },
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
      // here are the additional settings from Gleb's instructions
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
