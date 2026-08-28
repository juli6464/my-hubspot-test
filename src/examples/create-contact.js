const { createContact } = require('../services/hubSpotService.js');

async function run() {
    console.log('🚀 Iniciando prueba: Creación de contacto en HubSpot...');
    
    const contactData = {
        email: 'test.user3@example.com',
        firstname: 'Alberto',
        lastname: 'Ruiz',
        phone: '+573001234566'
    };

    try {
        const result = await createContact(contactData);
        console.log('✅ Contacto creado exitosamente:');
        console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error('❌ Error al crear el contacto:', error.message);
    }
}

run();