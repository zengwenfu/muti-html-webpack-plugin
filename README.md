# muti-html-webpack-plugin
> webpack不适合多页面应用么？那是因为你写的插件不够
> 改造自html-webpack-plugin，可以解析多个html页面模板，将html也纳入到webpack的管理当中

## 安装使用
1. npm install muti-html-webpack-plugin
2. 在webpack.config.js中引用之:
`var MutiHtmlWebpackPlugin = require('muti-html-webpack-plugin');`
3. 配置插件
```
    plugins: [
        extractCSS,
        new MutiHtmlWebpackPlugin({
            templatePath: 'views',
            loader: 'html?attrs=img:src img:data-src!compile-nunjucks',
            templateSuffix: '.html',
            path: '/views',
            ignore: ['demo.html', 'abc/abc.html']
        })
    ]
```

## 参数说明
1. templatePath: 需要解析的html模板根路径，插件将在这里寻找你的模板
2. loader: 用于解析模板的loader，配置方法同module.loaders配置，两处配置的loaders同时起作用，所以要注意避免配置重复的loader
```
    module: {
        loaders: [{
            test: /\.css$/,
            loader: 'style!css!change-rem',
            loader: extractCSS.extract('style', 'css')
        }, {
            //图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
            //如下配置，将小于8192byte的图片转成base64码
            test: /\.(png|jpg|gif)$/,
            loader: 'url-loader?limit=8192&context=client&name=./img/[name].[ext]?[hash:8]'
                // loader: [
                //     // url-loader更好用，小于10KB的图片会自动转成base64 dataUrl，
                //     // 否则则调用file-loader，参数直接传入
                //     'url-loader?limit=8192&context=client&name=./img/[name].[ext]?[hash:8]',
                //     'image?{bypassOnDebug:true, progressive:true,optimizationLevel:3,pngquant:{quality:"65-80",speed:4}}'
                // ]
        }, {
            //html模板加载器，可以处理引用的静态资源，默认配置参数attrs=img:src，处理图片的src引用的资源
            //比如配置，attrs=img:src img:data-src就可以一并处理data-src引用的资源了，就像下面这样
            test: /\.html$/,
            // include: 'test/css',
            //这里的插件对所有.html都起作用
            loader: 'html?attrs=img:src img:data-src'
        }]
    },
    plugins: [
        extractCSS,
        new MutiHtmlWebpackPlugin({
            templatePath: 'test/views/',
            //这里的loader只对插件要处理的模板起作用
            loader: 'html?attrs=img:src img:data-src!compile-nunjucks'
            templateSuffix: '.html',
            path: '/views',
            ignore: ['demo.html', 'abc/abc.html']
        })
    ]
```
示例中，module.loaders对所有.html的文件都起作用
插件中的loaders对插件配置的的模板文件起作用，模板后缀是.html
所以相当于对模板文件使用了'html!compile-nunjucks!html'三个解析器，导致解析失败。
解决办法，module.loaders中的配置增加include过滤

3. templateSuffix: 模板后缀，用于过滤非模板文件，不传则解析templatePath下的所有文件
4. ignore: 过滤掉的模板文件，单个文件可以传string，多个文件传数组。场景：公共的头部模板，只是用于引用，我们是不需要解析成单独的文件的

## 使用注意
html中引用webpack打包出来的js和css，可以使用##entry.[name].js/css##
```
    <!DOCTYPE html>
    <html>
    <head>
        <title>demo</title>
        <link rel="stylesheet" type="text/css" href="##entry.demo1.css##">
    </head>
    <body>
        <img src="../../../img/dog.jpg" />
        HELLO WORLD !!!
        <script type="text/javascript" src='##entry.demo.js##'></script>
    </body>
    </html>
```
对应于webpack.config.js中的entry配置
```
    entry: {
        demo: ['./test/js/demo.js'],
        demo1: ['./test/js/demo1.js']
    }
```
其中entry.[name].css对应于css文件（当然，不使用ExtractTextPlugin插件你是拿不到独立的css文件的），
entry.[name].js对应于js的bundle
如果匹配不到，那么插件不会做任何替换，页面没有拿到正确的引用，只能只求多福了，阿弥陀佛

![](https://nodei.co/npm/muti-html-webpack-plugin.png)



