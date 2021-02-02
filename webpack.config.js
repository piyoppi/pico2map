const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    main: './src/main.ts',
    autotile: './src/autotile.ts'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  }
};
