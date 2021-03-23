module.exports = {
  // 公共路径(必须有的)
  publicPath: "./",
  // 输出文件目录
  outputDir: "randomDraw",
  // eslint-loader 是否在保存的时候检查
  lintOnSave:false,
  // 不需要生产环境的设置false可以减小dist文件大小，加速构建
  productionSourceMap: false,
  configureWebpack: {
    devtool: 'source-map', //默认是：cheap-module-eval-source-map
  }
}