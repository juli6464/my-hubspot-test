const contactRepo = require('../repositories/contactRepository');
const dealRepo = require('../repositories/dealRepository');
const hubSpotClient = require('../clients/hubSpotClient');
const { retryWithBackoff, handleHubSpotErrors } = require('../utils/handleErrors');
const { pipelineId, stageId } = require('../config/env');
const { validateContact, validateDeal } = require('../utils/validator');

async function associateContactToDeal(contactId, dealId) {
  try {
    const url = `/crm/v4/objects/contacts/${contactId}/associations/deals/${dealId}`;
    const response = await retryWithBackoff(() =>
      hubSpotClient.put(url, [
        {
          category: 'HUBSPOT_DEFINED',
          typeId: 3,
        },
      ])
    );
    return response.data;
  } catch (error) {
    handleHubSpotErrors(error);
  }
}

async function createDealWithDefaultPipeline(dealName, amount) {
  validateDeal({ dealname: dealName, amount });
  return await dealRepo.createHubSpotDeal(dealName, amount, pipelineId, stageId);
}

async function createContactWithValidation(properties) {
  validateContact(properties);
  return await contactRepo.createHubSpotContact(properties);
}

async function syncContactsWithHubSpot(localContacts) {
  const results = { created: 0, updated: 0, errors: 0 };
  
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

module.exports = {
  associateContactToDeal,
  createDealWithDefaultPipeline,
  createContact: createContactWithValidation,
  syncContactsWithHubSpot,
  getContactNames: contactRepo.getHubSpotContactNames,
  getContacts: contactRepo.getHubSpotContacts,
  updateContact: contactRepo.updateHubSpotContact,
  deleteContact: contactRepo.deleteHubSpotContact,
  getDeals: dealRepo.getHubSpotDeals,
  updateDeal: dealRepo.updateHubSpotDeal,
  deleteDeal: dealRepo.deleteHubSpotDeal,
};