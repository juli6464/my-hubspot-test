const { Readable, Transform } = require('stream');

function runStreamExample() {
  const readableStream = Readable.from(['probando streams en node.js para hubspot... \n']);
  
  const upperCaseTransform = new Transform({
    transform(chunk, encoding, callback) {
      callback(null, chunk.toString().toUpperCase());
    },
  });

  readableStream.pipe(upperCaseTransform).pipe(process.stdout);
}

module.exports = { runStreamExample };