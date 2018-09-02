
var path = require('path');

module.exports.getAbsPath = (relPath) => {
    return path.resolve(relPath);
}