// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/adverts': {
        target: 'http://ihotel.meituan.com/campaigns/v1/adverts/batch/details?app=group&category=1&cityId=1&biz=1&clienttp=android&version=v1&boothIds=12&platform=5&os=999&uuid=c0d0e2966d7ed3d6ba4e.1492427002.0.0.0',
        changeOrigin: true,
      },
      '/locate/latlng': {
        target: 'http://ihotel.meituan.com/group/v1/deal/search/hotword/city/1?reqType=0&ci=1&client=iphone&utm_medium=touch&utm_term=999.9&version_name=999.9&uuid=52731044CB1B9B6344E2F6D98B1B744EE9CC95B06FE7D45B8A2B16BC56C5F303&platformid=1',
        changeOrigin: true,
      },
      '/area/search': {
        target: 'http://ihotel.meituan.com/group/v1/',
        changeOrigin: true,
        pathRewrite: {
          '^/area/search': 'area/search'
        }
      },
      '/search/hotword/city': {
        target: 'https://ihotel.meituan.com/group/v1/deal/',
        changeOrigin: true,
        pathRewrite: {
          '^/search/hotword/city': 'search/hotword/city'
        }
      },
      '/search/morehotword/city': {
        target: 'https://ihotel.meituan.com/group/v1/deal/',
        changeOrigin: true,
        pathRewrite: {
          '^/search/morehotword/city': 'search/morehotword/city'
        }
      },
      '/search/suggest': {
        target: 'https://ihotel.meituan.com/group/v2/deal/',
        changeOrigin: true,
        pathRewrite: {
          '^/search/suggest/': 'search/suggest/'
        }
      }
    },
    onProxyReq: function onProxyReq(proxyReq, req, res) {
      console.log(proxyReq);
      console.log(proxyReq);
      console.log(res);
        // add custom header to request
        // or log the req
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
