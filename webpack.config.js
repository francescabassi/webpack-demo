const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');
const parts = require('./libs/parts');

const dirname = __dirname;
const curprocess = process;

const PATHS = {
  app: path.join(dirname, 'app'),
  style: [
    path.join(dirname, 'node_modules', 'purecss'),
    path.join(dirname, 'app', 'main.css')
  ],
  images: path.join(dirname, 'images'),
  fonts: path.join(dirname, 'fonts'),
  build: path.join(dirname, 'build')
};

const common = {
  entry: {
    style: PATHS.style,
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  module: {
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        include: PATHS.app
      }
    ],
    loaders: [
      {
        test: /\.(jpg|png)$/,
        loader: 'url?limit=25000',
        include: PATHS.images
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'file?name=[path][name].[hash].[ext]',
        include: PATHS.images
      },
      {
        test: /\.svg$/,
        loader: 'file',
        include: PATHS.images
      },
      {
        test: /\.woff$/,
        loader: 'url',
        query: {
          name: 'font/[hash].[ext]',
          limit: 5000,
          mimetype: 'application/font-woff'
        },
        include: PATHS.fonts
      },
      {
        test: /\.ttf$|\.eot$/,
        loader: 'file',
        query: {
          name: 'font/[hash].[ext]'
        },
        include: PATHS.fonts
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo'
    })
  ]
};

var config;

switch (curprocess.env.npm_lifecycle_event) {
case 'build':
case 'stats':
  config = merge(
    common,
    {
      devtool: 'source-map',
      output: {
        path: PATHS.build,
        publicPath: '/webpack-demo/',
        filename: '[name].[chunkhash].js',
        chunkFilename: '[chunkhash].js'
      }
    },
    parts.clean(PATHS.build),
    parts.setFreeVariable(
      'process.env.NODE_ENV',
      'production'
    ),
    parts.extractBundle({
      name: 'vendor',
      entries: ['react']
    }),
    parts.minify(),
    parts.extractCSS(PATHS.style),
    parts.purifyCSS([PATHS.app])
  );
  break;
default:
  config = merge(
    common,
    {
      devtool: 'eval-source-map'
    },
    parts.setupCSS(PATHS.style),
    parts.devServer({
      host: curprocess.env.HOST,
      port: curprocess.env.PORT
    })
  );
}

module.exports = validate(config);
