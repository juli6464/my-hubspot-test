const contactRepo = require('../repositories/contactRepository');
const dealRepo = require('../repositories/dealRepository');
const hubSpotClient = require('../clients/hubSpotClient');
const {
  retryWithBackoff,
  handleHubSpotErrors
} = require('../utils/handleErrors');
const {
  pipelineId,
  stageId
} = require('../config/env');
const {
  validateContact,
  validateDeal
} = require('../utils/validator');

async function associateContactToDeal(contactId, dealId) {
  try {
    const url = `/crm/v4/objects/contacts/${contactId}/associations/deals/${dealId}`;
    const response = await retryWithBackoff(() =>
      hubSpotClient.put(url, [
        {
          associationCategory: 'HUBSPOT_DEFINED',
          associationTypeId: 4,
        },
      ])
    );
    return response.data;
  } catch (error) {
    handleHubSpotErrors(error);
  }
}

async function createDealWithDefaultPipeline(dealName, amount) {
  validateDeal({
    dealname: dealName,
    amount
  });
  return await dealRepo.createHubSpotDeal(dealName, amount, pipelineId, stageId);
}

async function createContactWithValidation(properties) {
  validateContact(properties);
  return await contactRepo.createHubSpotContact(properties);
}

async function syncContactsWithHubSpot(localContacts) {
  const results = {
    created: 0,
    updated: 0,
    errors: 0
  };

  for (const local of localContacts) {
    try {
      validateContact(local);
      // Lógica idempotente simulada: Buscar por email o crear/actualizar
      const existingContacts = await contactRepo.getHubSpotContacts();
      const found = existingContacts.find(c => c.properties.email === local.email);

      if (found) {
        await contactRepo.updateHubSpotContact(found.id, local);
        results.updated++;
      } else {
        await contactRepo.createHubSpotContact(local);
        results.created++;
      }
    } catch (error) {
      console.error(`Error sincronizando contacto ${local.email}:`, error.message);
      results.errors++;
    }
  }
  return results;
}

async function syncDealsWithHubSpot(localDeals) {
  const results = { created: 0, updated: 0, errors: 0 };

  for (const local of localDeals) {
    try {
      // 1. Extraemos contactEmail y dejamos solo las propiedades reales del negocio para HubSpot
      const { contactEmail, ...dealProperties } = local;
      validateDeal(dealProperties);

      const existingDeals = await dealRepo.getHubSpotDeals();
      // Imprimimos todos los tratos que trae HubSpot para verificar nombres e IDs reales
      console.log('Tratos encontrados en HubSpot:', existingDeals.map(d => ({ id: d.id, name: d.properties.dealname })));
      const found = existingDeals.find(d => d.properties.dealname === dealProperties.dealname);

      let dealId;

      if (found) {
        console.log(`🔍 Encontrado en HubSpot -> ID: ${found.id} | Nombre Local: ${dealProperties.dealname}`);
        // Excluimos pipeline y etapas para evitar conflictos de ID al actualizar
        const { pipeline, dealstage, hs_stage, ...rest } = dealProperties;
        
        // Armamos el objeto limpio con las propiedades editables
        const updatableProperties = {
          dealname: rest.dealname,
          amount: rest.amount ? rest.amount.toString() : undefined
        };
        
        await dealRepo.updateHubSpotDeal(found.id, updatableProperties);
        dealId = found.id;
        results.updated++;
      } else {
        const createdDeal = await dealRepo.createHubSpotDeal(
          dealProperties.dealname, 
          dealProperties.amount, 
          pipelineId, 
          stageId
        );
        dealId = createdDeal.id;
        results.created++;
      }

      // 2. Si hay un email asociado, buscamos el contacto y hacemos la asociación v4
      if (contactEmail && dealId) {
        const existingContacts = await contactRepo.getHubSpotContacts();
        const foundContact = existingContacts.find(c => c.properties.email === contactEmail);
        
        if (foundContact) {
          await associateContactToDeal(foundContact.id, dealId);
          console.log(`🔗 Contacto ${foundContact.id} asociado exitosamente al negocio ${dealId}`);
        }
      }
    } catch (error) {
      console.error(`Error sincronizando negocio ${local.dealname}:`, error.message);
      results.errors++;
    }
  }
  return results;
}

module.exports = {
  associateContactToDeal,
  createDealWithDefaultPipeline,
  createContact: createContactWithValidation,
  syncContactsWithHubSpot,
  syncDealsWithHubSpot,
  getContactNames: contactRepo.getHubSpotContactNames,
  getContacts: contactRepo.getHubSpotContacts,
  updateContact: contactRepo.updateHubSpotContact,
  deleteContact: contactRepo.deleteHubSpotContact,
  getDeals: dealRepo.getHubSpotDeals,
  updateDeal: dealRepo.updateHubSpotDeal,
  deleteDeal: dealRepo.deleteHubSpotDeal,
};