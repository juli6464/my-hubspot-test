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

if (require.main === module) {
  simulateAsyncOperationWithCallback('./src/examples/deals-seed.json', (err, data) => {
    if (err) {
      console.error('[Callback Error]:', err.message);
    } else {
      console.log('[Callback Success] Datos leídos correctamente. Longitud:', data.length);
    }
  });
}

module.exports = { simulateAsyncOperationWithCallback };