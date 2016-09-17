# muti-html-webpack-plugin

1. 传入templatePath，html模板路径，不传./
2. 传入loader去build html模板，不传使用默认的loader.js，解析ejs的
3. templateSuffix，模板后缀，用于过滤模板，不传则不过滤
4. path，相对于output中配置的path，不传则相等


##问题
1. 如果目录views目录只有一级 readDir会出问题
