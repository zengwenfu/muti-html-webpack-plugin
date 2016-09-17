/**
 * create by zengwenfu 
 */
'use strict';

var fs = require('fs');

module.exports = function(path, suffix, outputPath) {
    return new Promise(function(resolve, reject) {
        var dirs = [];
        var over_dir = [];
        var over = {};
        dirs.push(path)

        function forDir(dirs) {
            function forFiles(files, file_path) {
                var fixdir = [];
                files.forEach(function(e, i) {
                    var e = file_path + '/' + e;
                    fs.stat(e, function(err, stat) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        }
                        if (stat.isDirectory()) {
                            fixdir.push(e)
                            over_dir.push(e)
                        } else {
                            if(!suffix || e.indexOf(suffix) >=0 ) {
                                var key = e.substring(path.length + 1);
                                if(!suffix && key.indexOf('.html')>=0) {//默认过滤掉.html
                                    key = key.substring(0, key.indexOf('.html'));
                                } else if(!!suffix){
                                    key = key.substring(0, key.indexOf(suffix));
                                }
                                if(!!outputPath) {
                                    key = outputPath + '/' + key;
                                }
                                over[key] = e;
                            }
                        }
                        if (i == files.length - 1) {
                            if (file_path == over_dir[over_dir.length - 1]) {
                                resolve(over);
                            }
                            if (fixdir.length > 0) {
                                forDir(fixdir)
                            }
                        }
                    })
                })
            }

            dirs.forEach(function(e, i) {
                fs.readdir(e, function(err, files) {
                    if(err) {
                        console.log(err);
                        reject(err);
                    }
                    forFiles(files, e)
                })
            });
        }

        forDir(dirs);
    });
}
