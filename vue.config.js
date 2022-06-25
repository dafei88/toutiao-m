const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pages: {
    index: {
      entry: "src/main.js"
    }
  },
  devServer: {
    // 解决跨域问题
    proxy: {
      '/api': {
        target: 'http://toutiao.itheima.net',
        pathRewrite: {
          '^/api': ''
        },
        ws: true,
        changeOrigin: true
      }
    }
  }
})
