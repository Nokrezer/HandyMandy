const path = require('path');

module.exports = {
  mode: 'production',
  entry: './vendor.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'react-vendor-bundle.js',
    library: { type: 'window' },  // Современный способ для webpack 5
    clean: true
  },
  experiments: {
    outputModule: false
  },
  optimization: {
    minimize: true
  }
};