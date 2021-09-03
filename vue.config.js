/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

const resolve = dir => {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/',
  assetsDir: 'static',
  productionSourceMap: false,
  css: {
    extract: false
  },
  configureWebpack: config => {
    config.performance = {
      hints: 'warning',
      maxEntrypointSize: 50000000,
      maxAssetSize: 30000000,
      assetFilter: assetFilename => assetFilename.endsWith('.js')
    }
    config.externals = {
      ace: 'ace'
    }
  },
  chainWebpack: config => {
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.resolve.alias
      .set('@', resolve('src'))
      .set('ejs', 'ejs/ejs.min.js')

    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()
  },
  devServer: {
    proxy: {
      '/system': {
        target: 'http://127.0.0.1:8888',
        ws: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/system/, '/system/')
      },
    }
  },

}
