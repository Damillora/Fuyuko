const mime = require('mime-types');
const fs = require('fs');
const path = require('path');

var handleFile = function(filePath, req, res, next) {
    fs.lstat(filePath, function(err,stats) {
        if(err) {
            if(err.code === 'ENOENT') {
                next();
            }
        }
        if(stats.isDirectory()) {
            if(filePath.endsWith("/")) {
                handleFile(path.join(filePath,'/index.gmi'), req, res, next);
            } else {
                res.redirect(req.path+"/");
            }
            return;
        }
        fs.open(filePath, 'r', function (err, fd) {
            var contents = fs.readFileSync(fd);
            res.meta = "text/gemini";
            res.end(contents);
        });
    });
}

module.exports = function(documentRoot) {
    return function(req, res, next) {
        var filePath = path.join(process.env.DOCUMENT_ROOT, req.path);
        handleFile(filePath,req,res,next);
    }
}
