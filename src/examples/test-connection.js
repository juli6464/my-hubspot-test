const service = require('../services/hubSpotService');

async function testConnection() {
  console.log('Probando conexión y llamada real a HubSpot...');
  try {
    // Intentamos listar los nombres de contactos (llamada GET real)
    const names = await service.getContactNames();
    console.log('¡Conexión exitosa con HubSpot!');
    console.log(`Contactos encontrados en tu portal: ${names.length}`);
    if (names.length > 0) {
      console.log('Primeros contactos:', names.slice(0, 5));
    }
  } catch (error) {
    console.error('Error al conectar con HubSpot:', error.message);
  }
}

testConnection();