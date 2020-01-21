const webpack = require("webpack")
const path = require("path");
const fileSystem = require("fs");
const env = require("./scripts/env");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

function resolvePath (destination) {
  return path.join(__dirname, "src", destination)
}

const alias = {
  '@lib': resolvePath("lib"),
};

const secretsPath = path.join(__dirname, ("secrets." + env.NODE_ENV + ".js"));

const fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

if (fileSystem.existsSync(secretsPath)) {
  alias["secrets"] = secretsPath;
}

const options = {
  mode: 'development',
  entry: {
    popup: resolvePath("popup/popup.js"),
    options: resolvePath("options/options.js"),
    background: resolvePath("background/background.js"),
    parse: path.join(__dirname, "src", "content-scripts", "parse.js"),
    widget: path.join(__dirname, "src", "content-scripts", "widget.js"),
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "[name].js"
  },
  node: {
    child_process: 'empty',
    fs: 'empty',
    crypto: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  module: {
    rules: [
      {
        test: new RegExp('\.(' + fileExtensions.join('|') + ')$'),
        loader: "file-loader?name=[name].[ext]",
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        exclude: /node_modules/
      },
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: false,
            hotReload: false
          }
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [
                  './src/theme',
                  './node_modules'
                ]
              }
            }
          }
        ]
      }
    ]
  },
  resolve: {
    alias: alias,
  },
  plugins: [
    new CleanWebpackPlugin(["build"]),
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
      "process.env.VERSION": JSON.stringify(process.env.npm_package_version)
    }),
    new CopyWebpackPlugin([{
      from: "src/manifest.json",
      transform: function (content, path) {
        return Buffer.from(JSON.stringify({
          description: process.env.npm_package_description,
          version: process.env.npm_package_version,
          ...JSON.parse(content.toString())
        }))
      }
    }]),
    ...['popup', 'options', 'background'].map(page => new HtmlWebpackPlugin({
      template: resolvePath(`${page}/${page}.html`),
      filename: `${page}.html`,
      chunks: [page]
    })),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].[id].css'
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }]
      },
      canPrint: true
    }),
    new WriteFilePlugin(),
    new FileManagerPlugin({
      onEnd: {
        archive: [
          {
            source: path.join(__dirname, "build"),
            destination: path.join(__dirname, "packages", `${env.NODE_ENV}-v${process.env.npm_package_version}.zip`)
          },
        ]
      }
    })
  ].filter(Boolean),
  chromeExtensionBoilerplate: {
    notHotReload: [
      'widget',
    ]
  }
};

if (env.NODE_ENV === "development") {
  options.devtool = "cheap-module-eval-source-map";
}

module.exports = options;
