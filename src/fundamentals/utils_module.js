function sumArray(numbers) {
  if (!Array.isArray(numbers)) throw new Error('Se esperaba un arreglo de números');
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

module.exports = { sumArray };