const path = require('path');
const webpack = require('webpack');
const pkg = require('./package.json');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postcssPrefixer = require('postcss-prefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const isDevServer = process.env.DEV_SERVER === 'true';
const FILENAME = pkg.name + (isProduction ? '.min' : '');
const BANNER = [
  'Flex2Html',
  '@version ' + pkg.version + ' | ' + new Date().toDateString(),
  '@author ' + pkg.author,
  '@license ' + pkg.license,
].join('\n');

const config = {
  entry: ['./src/scss/index.scss', './src/index.ts'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: FILENAME + '.js',
    library: ['flex2html'],
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@flex2html': path.resolve(__dirname, './src/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader', 'eslint-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          isDevServer ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                postcssPrefixer({
                  prefix: 'flex2html-',
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g)$/,
        use: 'url-loader',
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: BANNER,
      entryOnly: true,
    }),
    new StyleLintPlugin(),
    new MiniCssExtractPlugin({
      filename: `${FILENAME}.css`,
    }),
    new HtmlWebpackPlugin({
        template: "./src/index.html",
    }),
  ],
  devtool: 'source-map',
  devServer: {
    index: 'index.html',
    historyApiFallback: false,
    host: '0.0.0.0',
    disableHostCheck: true,
  },
};
module.exports = config;
