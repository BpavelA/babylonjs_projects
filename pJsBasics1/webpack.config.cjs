const { info } = require('console');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  stats:'errors-only',
  devtool:'source-map',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
    watchFiles: ['src/**/*.js', 'public/**/*'],
    hot:true,
    client:{
      logging:'log',
      progress:true
    }
  },
  experiments:{
    topLevelAwait: true
  }
};