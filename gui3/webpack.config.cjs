const path = require('path');

module.exports = {
  mode: 'development',
  entry: './main.js',
  stats:'errors-only',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  devtool:'source-map',
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 9000,
    watchFiles: ['./**/*.js', 'public/**/*'],
    hot:true
  },
  experiments:{
    topLevelAwait: true
  }
};
