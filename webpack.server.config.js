const path = require('path')
const nodeExternals = require('webpack-node-externals')
const Dotenv = require('dotenv-webpack'); // Adds support to .env files

module.exports = () => {
  return ({
    entry: {
      index: './src/index.js',
    },
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      filename: '[name].js'
    },
    target: 'node',
    node: {
      // Need this when working with express, otherwise the build fails
      __dirname: false,   // if you don't put this is, __dirname
      __filename: false,  // and __filename return blank or /
    },
    // externals: [nodeExternals()], // If enabled it will skip all external dependencies to be bundled
    module: {
      rules: [
        {
          enforce: "pre",
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "eslint-loader",
          options: {
            emitWarning: true,
            failOnError: false,
            failOnWarning: false
          }
        },
        {
          // Transpiles ES6-8 into ES5
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        }
      ]
    },
    plugins: [
      new Dotenv()
    ]
  })
}
