var fs = require('fs');
var path = require('path');
var async = require('async');


//分文件夹输出
function getFileList(dirname, suffix, outputPath, callback, error) {
    var fileJson = {

    };
    var a = (function listFiles(dirname, fn, error) {
        var files = fs.readdirSync(dirname);
        async.eachSeries(files, function(item, next) {
            var filePath = path.normalize(dirname + '/' + item);
            var info = fs.statSync(filePath);
            if (info.isDirectory()) {
                listFiles(filePath, function() {
                    next();
                });
            } else {
                if (!suffix || item.indexOf(suffix) >= 0) {
                    var key = item;
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
        error(err);
    });
};


module.exports = function(path, suffix, outputPath) {
    return new Promise(function(resolve, reject) {
        getFileList(path, suffix, outputPath, function(files) {
            console.log(files);
            resolve(files);
        }, function(err) {
            reject(err);
        });
    }); 
}




