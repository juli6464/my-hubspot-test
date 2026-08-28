const { sumArray } = require('./utils_module');

const numbers = [10, 20, 30, 40, 50];
const total = sumArray(numbers);

console.log(`[CommonJS] La suma del arreglo [${numbers.join(', ')}] es: ${total}`);

module.exports = { total };