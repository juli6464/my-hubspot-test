const service = require('../services/hubSpotService');

async function run() {
  const dealName = 'Negocio de Prueba Técnico Node.js';
  const amount = 1500;
  console.log(`Creando negocio: "${dealName}" por valor de $${amount}...`);
  try {
    const deal = await service.createDealWithDefaultPipeline(dealName, amount);
    console.log('Negocio creado exitosamente:', deal.id);
  } catch (error) {
    console.error('Fallo al crear negocio:', error.message);
  }
}

run();