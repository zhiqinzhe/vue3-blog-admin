const path = require('path');
const portfinder = require('portfinder');
const outputStaticUrl = require('./utils/outputStaticUrl');

const { chalkINFO, emoji } = require('./utils/chalkTip');

console.log(
  chalkINFO(`读取：${__filename.slice(__dirname.length + 1)}`),
  emoji.get('white_check_mark')
);

module.exports = new Promise((resolve) => {
  // 默认端口8000，如果被占用了，会自动递增+1
  const port = 8000;
  portfinder.basePort = port;
  portfinder
    .getPortPromise({
      port,
      stopPort: 9000,
    })
    .then((port) => {
      resolve({
        target: 'web',
        mode: 'development',
        devtool: 'source-map',
        stats: 'errors-warnings', // 只显示警告和错误信息（webpack-dev-server4.x后变了）
        cache: {
          // type: 'filesystem', // 长缓存，如果是内存缓存的话，下次启动就没了
          type: 'memory',
        },
        devServer: {
          client: {
            logging: 'none', // https://webpack.js.org/configuration/dev-server/#devserverclient
          },
          hot: true, // hrm，开启模块热替换
          // hotOnly: true, // 默认情况下（hotOnly:false），如果编译失败会刷新页面。设置了true后就不会刷新整个页面
          // hot: 'only', // 要在构建失败的情况下启用热模块替换而不刷新页面作为后备，请使用hot: 'only'在vue项目的话，使用only会导致ts文件没有热更，得使用true
          compress: true, // 开启gizp压缩
          port, // 默认端口号8080
          historyApiFallback: {
            rewrites: [
              // 如果publicPath设置了/abc，就不能直接设置historyApiFallback: true，这样会重定向到react-webpack-template根目录下的index.html
              // publicPath设置了/abc，就重定向到/abc，这样就可以了
              { from: outputStaticUrl(), to: outputStaticUrl() },
            ],
          },
          /**
           * contentBase默认为package.json文件所在的根目录，即react-webpack-template目录
           * 打开localhost:8080/hss/demo.js,就会访问react-webpack-template目录下的hss目录下的demo.js。
           * 设置contentBase: path.resolve(__dirname, '../hss')后，打开localhost:8080/demo.js,即可访问react-webpack-template目录下的hss目录下的demo.js
           * 这个目录最好和copyWebpackPlugin插件目录一致
           */
          // contentBase: path.resolve(__dirname, '../public'),
          // watchContentBase: true, // 监听contenBase目录
          // publicPath: '/', // devServer的publicPath建议与output的publicPath一致
          static: {
            // （webpack-dev-server4.x后变了）
            directory: path.resolve(__dirname, '../public'),
            watch: true,
            publicPath: outputStaticUrl(),
          },
          proxy: {
            '/api': {
              // target: 'https://www.zhengbeining.com/api/',  //默认：/api/type/pageList ===>https://www.zhengbeining.com/api/api/type/pageList
              // target: 'http://42.193.157.44/api', // 默认：/api/type/pageList ===>https://www.zhengbeining.com/api/api/type/pageList
              target: 'http://localhost:3200', // 默认：/api/type/pageList ===>https://www.zhengbeining.com/api/api/type/pageList
              secure: false, // 默认情况下（secure: true），不接受在HTTPS上运行的带有无效证书的后端服务器。设置secure: false后，后端服务器的HTTPS有无效证书也可运行
              /**
               * changeOrigin，是否修改请求地址的源
               * 默认changeOrigin: false，即发请求即使用devServer的localhost:port发起的，如果后端服务器有校验源，就会有问题
               * 设置changeOrigin: true，就会修改发起请求的源，将原本的localhost:port修改为target，这样就可以通过后端服务器对源的校验
               */
              changeOrigin: true,
              pathRewrite: {
                '^/api': '', // 重写后：/api/type/pageList ===>https://www.zhengbeining.com/api/type/pageList
              },
            },
          },
        },
        plugins: [],
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
