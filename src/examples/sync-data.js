const path = require('path');
const fs = require('fs');
const service = require('../services/hubSpotService');

async function runSync() {
  console.log('Iniciando sincronización de contactos locales con HubSpot...');
  
  try {
    // Ruta al archivo JSON local de prueba
    const seedPath = path.join(__dirname, 'contacts-seed.json');
    
    if (!fs.existsSync(seedPath)) {
      console.error('No se encontró el archivo contacts-seed.json. Por favor créalo primero.');
      return;
    }

    const rawData = fs.readFileSync(seedPath, 'utf8');
    const localContacts = JSON.parse(rawData);

    console.log(`Se encontraron ${localContacts.length} contactos en el archivo local para sincronizar.`);

    // Ejecutamos la función de sincronización del servicio
    const result = await service.syncContactsWithHubSpot(localContacts);

    console.log('Sincronización finalizada con éxito:');
    console.log(`- Creados: ${result.created}`);
    console.log(`- Actualizados: ${result.updated}`);
    console.log(`- Errores: ${result.errors}`);
  } catch (error) {
    console.error('Error crítico durante la sincronización:', error.message);
  }
}

runSync();