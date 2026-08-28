const fs = require('fs');
const path = require('path');

function simulateAsyncOperationWithCallback(filePath, callback) {
  setTimeout(() => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return callback(err);
      }
      callback(null, data.trim());
    });
  }, 500);
}

module.exports = { simulateAsyncOperationWithCallback };