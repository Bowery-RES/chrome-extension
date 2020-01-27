const WebpackDevServer = require('webpack-dev-server')
const webpack = require('webpack')
const path = require('path')
const config = require('../webpack.config')
const env = require('./env')

const options = (config.chromeExtensionBoilerplate || {})
const excludeEntriesToHotReload = (options.notHotReload || [])

for (const entryName in config.entry) {
  if (excludeEntriesToHotReload.indexOf(entryName) === -1) {
    config.entry[entryName] = [
      (`webpack-dev-server/client?http://${require('os').hostname()}:${env.PORT}`),
      'webpack/hot/dev-server',
    ].concat(config.entry[entryName])
  }
}

config.plugins = [new webpack.HotModuleReplacementPlugin()].concat(config.plugins || [])

delete config.chromeExtensionBoilerplate

const compiler = webpack(config)

const server = new WebpackDevServer(compiler, {
  disableHostCheck: true,
  port: env.PORT,
  contentBase: path.join(__dirname, '../build'),
  headers: { 'Access-Control-Allow-Origin': '*' },
})

server.listen(env.PORT)
