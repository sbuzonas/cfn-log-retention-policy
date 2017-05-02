const webpack = require('webpack');
const path = require('path');

const config = {
  entry: './lib/resource',
  output: {
    path: path.join(__dirname, '/dist'),
    libraryTarget: 'commonjs2',
    filename: 'resource.js',
  },
  resolve: {
    extensions: ['.ts', '.js', '.json']
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ },
    ]
  },
  target: 'node',
  externals: [
    function (context, request, callback) {
      if (/^aws-sdk(\/|$)/.test(request)) {
        return callback(null, "commonjs2 " + request);
      }
      callback();
    }
  ],
  plugins: [
    new webpack.IgnorePlugin(/regenerator|nodent/, /ajv-async/)
  ]
}

module.exports = config;
