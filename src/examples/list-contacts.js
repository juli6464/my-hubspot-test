const service = require('../services/hubSpotService');

async function run() {
  console.log('Obteniendo nombres completos de contactos desde HubSpot...');
  try {
    const names = await service.getContactNames();
    console.log(`Contactos encontrados (${names.length}):`, names);
  } catch (error) {
    console.error('Fallo al listar contactos:', error.message);
  }
}

run();