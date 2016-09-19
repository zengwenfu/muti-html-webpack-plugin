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
2. loader: 用于解析模板的loader，配置方法同webpack其它的loader配置
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




