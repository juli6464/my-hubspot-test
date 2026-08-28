const fs = require('fs/promises');
const path = require('path');

async function readFileAsync(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data;
  } catch (error) {
    throw new Error(`Error leyendo archivo: ${error.message}`);
  }
}

async function run() {
  console.log('[Async/Await] Ejecutando prueba de asincronía...');
  try {
    // Simulamos leyendo el package.json como prueba interna
    const content = await readFileAsync(path.join(__dirname, '../../package.json'));
    console.log('[Async/Await] Lectura exitosa. Longitud del package.json:', content.length);
  } catch (error) {
    console.error('[Async/Await Error]:', error.message);
  }
}

if (require.main === module) {
  run();
}

module.exports = { readFileAsync };