const path = require('path')

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@pages': path.resolve(__dirname, 'src', 'pages'),
      '@types': path.resolve(__dirname, 'src', 'types'),
      '@store': path.resolve(__dirname, 'src', 'store'),
      '@utils': path.resolve(__dirname, 'src', 'utils'),
      '@assets': path.resolve(__dirname, 'src', 'assets'),
      '@components': path.resolve(__dirname, 'src', 'components'),
    },
  },
}

// create-react-app + ts 配置路径别名流程
// st1、安装@craco/craco并在项目根目录新建craco.config.js，用于配置并覆盖webpack路径别名alias
// st2、在package.json中将`react-scripts`的start、build、test这三个指令更改为由`craco`启动
// st3、在项目根目录中新建 path.tsconfig.json 用于配置vscode路径识别
// st4、将path.tsconfig.json 以'extends'的方式导入到 tsconfig.json中
// 以上流程可以结合参考antd官网craco的配置：https://ant.design/docs/react/use-in-typescript-cn

// N1、项目配置文件更新后必须重启项目才会生效
// N2、配置完别名后未配置vscode路径识别，重启项目后可能会报错找不到xxx模块，因此建议以上4步骤完成后再重启项目进行别名使用
