var fs = require('fs');
var path = require('path');
var async = require('async');


//分文件夹输出
function getFileList(dirname, suffix, outputPath, ignore, callback, error) {
    var fileJson = {};
    if(ignore && typeof ignore === 'object') {
        ignore = ignore.join(',');
    }

    var a = (function listFiles(rootPath, fn, error) {
        var files;
        try {
            files = fs.readdirSync(rootPath);
        } catch(e) {
            console.log(e);
            error(e);
            return ;
        }
        async.eachSeries(files, function(item, next) {
            var filePath = path.normalize(rootPath + '/' + item);
            var info = fs.statSync(filePath);
            if (info.isDirectory()) {
                listFiles(filePath, function() {
                    next();
                });
            } else {
                if (!suffix || filePath.indexOf(suffix) >= 0) {
                    var key = filePath.substring(dirname.length + 1);
                    if(!ignore || ignore.indexOf(key) < 0) {
                        if (!suffix && key.indexOf('.html') >= 0) { //默认过滤掉.html
                            key = key.substring(0, key.indexOf('.html'));
                        } else if (!!suffix) {
                            key = key.substring(0, key.indexOf(suffix));
                        }
                        if (!!outputPath) {
                            key = outputPath + '/' + key;
                        }
                        fileJson[key] = filePath;
                    } 
                }

                next();
            }
        }, function(err) {
            if (!err) {
                fn && fn();
            } else {
                console.error("遍历模板路径失败:" + err);
                error && error(err);
            }
        });
    })(dirname, function() {
        callback(fileJson);
    }, function(err) {
        console.log(err);
        error(err);
    });
};


module.exports = function(path, suffix, outputPath, ignore) {
    var suffix = suffix || false;
    var outputPath = outputPath || false;
    var ignore = ignore || false;
    return new Promise(function(resolve, reject) {
        getFileList(path, suffix, outputPath, ignore, function(files) {
            resolve(files);
        }, function(err) {
            console.log(err);
            reject(err);
        });
    }); 
}




