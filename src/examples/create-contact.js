import { createHubSpotContact } from '../services/hubSpotService.js';

async function run() {
    console.log('🚀 Iniciando prueba: Creación de contacto en HubSpot...');
    
    const contactData = {
        properties: {
            email: 'test.user@example.com',
            firstname: 'Juan',
            lastname: 'Pérez',
            phone: '+573001234567'
        }
    };

    try {
        const result = await createHubSpotContact(contactData);
        console.log('✅ Contacto creado exitosamente:');
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('❌ Error al crear el contacto:', error.message);
    }
}

run();