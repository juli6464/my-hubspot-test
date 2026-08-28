const path = require('path');
const fs = require('fs');
const service = require('../services/hubSpotService');

async function runSync() {
  console.log('Iniciando sincronización masiva con HubSpot...');
  
  try {
    // 1. Sincronización de Contactos
    const contactsPath = path.join(__dirname, 'contacts-seed.json');
    if (fs.existsSync(contactsPath)) {
      const rawContacts = fs.readFileSync(contactsPath, 'utf8');
      const localContacts = JSON.parse(rawContacts);

      console.log(`\nSe encontraron ${localContacts.length} contactos para sincronizar.`);
      const contactResult = await service.syncContactsWithHubSpot(localContacts);
      
      console.log('Resultados de Contactos:');
      console.log(`- Creados: ${contactResult.created}`);
      console.log(`- Actualizados: ${contactResult.updated}`);
      console.log(`- Errores: ${contactResult.errors}`);
    } else {
      console.log('\nNo se encontró contacts-seed.json, se omite sincronización de contactos.');
    }

    // 2. Sincronización de Negocios (Deals)
    const dealsPath = path.join(__dirname, 'deals-seed.json');
    if (fs.existsSync(dealsPath)) {
      const rawDeals = fs.readFileSync(dealsPath, 'utf8');
      const localDeals = JSON.parse(rawDeals);

      console.log(`\nSe encontraron ${localDeals.length} negocios para sincronizar.`);
      const dealResult = await service.syncDealsWithHubSpot(localDeals);
      
      console.log('Resultados de Negocios:');
      console.log(`- Creados: ${dealResult.created}`);
      console.log(`- Actualizados: ${dealResult.updated}`);
      console.log(`- Errores: ${dealResult.errors}`);
    } else {
      console.log('\nNo se encontró deals-seed.json, se omite sincronización de negocios.');
    }

    console.log('\n¡Proceso de sincronización masiva finalizado!');
  } catch (error) {
    console.error('Error crítico durante la sincronización:', error.message);
  }
}

runSync();