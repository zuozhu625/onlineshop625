module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // 排除public目录下的JS/JSX文件扫描
      webpackConfig.module.rules[1].oneOf.forEach(rule => {
        if (rule.test && rule.test.toString().includes('js')) {
          // 保留原node_modules排除，新增public目录排除
          rule.exclude = [/node_modules/, new RegExp(`^${paths.appPublic}\/.*\.(js|jsx)$`)]; // 修正正则表达式起始符，确保严格匹配public目录下的JS/JSX文件
        }
      });
      // 调整HtmlWebpackPlugin模板路径
  webpackConfig.plugins = webpackConfig.plugins.map(plugin => {
    if (plugin.constructor.name === 'HtmlWebpackPlugin') {
      plugin.options.template = require('path').resolve(__dirname, 'public/index.html'); // 修正绝对路径为当前目录下的public/index.html文件
    }
    return plugin;
  });
  return webpackConfig;
    }
  },
  devServer: {
    port: 3006, // 新增：显式指定端口为3006
    client: {
      webSocketURL: 'ws://127.0.0.1:3006/ws'
    },
    host: '0.0.0.0',
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true
      }
    }
  }
};