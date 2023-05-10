const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    popup: './src/organize_main.jsx',
    // background file: './src/background
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      { 
        test: /\.(jsx|js)$/, 
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env', '@babel/preset-react'],
            }
        }
     },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
        },
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin({
    template: './src/organize_main.html',
    filename: 'organize_main.html',
  }),
  new CopyPlugin({
    patterns: [
      { from: "public" },
    ],
  })],
};