const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    autotile: './autotile/src/autotile.ts',
    minimum_example: './minimum_example/src/minimum_example.ts',
    simple_map_editor: './simple_map_editor/src/simple_map_editor.ts',
    colision_detector_sample: './colision_detector/src/colision_detector_sample.ts'
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
