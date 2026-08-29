const hubSpotClient = require('../clients/hubSpotClient');
const { retryWithBackoff, handleHubSpotErrors } = require('../utils/handleErrors');

async function createHubSpotDeal(dealName, amount, pipeline, stage) {
  try {
    const properties = {
      dealname: dealName,
      amount: amount.toString(),
      pipeline: pipeline,
      dealstage: stage,
    };
    const response = await retryWithBackoff(() =>
      hubSpotClient.post('/crm/v3/objects/deals', { properties })
    );
    return response.data;
  } catch (error) {
    handleHubSpotErrors(error);
  }
}

async function getHubSpotDeals() {
  try {
    // Agregamos el parámetro para no traer elementos archivados/eliminados
    const response = await retryWithBackoff(() =>
      hubSpotClient.get('/crm/v3/objects/deals', { 
        params: { limit: 100, archived: false } 
      })
    );
    return response.data.results || [];
  } catch (error) {
    handleHubSpotErrors(error);
  }
}

async function updateHubSpotDeal(dealId, dealProperties) {
  try {
    // Garantizamos que las propiedades vayan siempre dentro del objeto { properties: { ... } }
    const payload = dealProperties.properties 
      ? dealProperties 
      : { properties: dealProperties };

    const response = await retryWithBackoff(() =>
      hubSpotClient.patch(`/crm/v3/objects/deals/${dealId}`, payload)
    );
    return response.data;
  } catch (error) {
    handleHubSpotErrors(error);
  }
}

async function deleteHubSpotDeal(dealId) {
  try {
    const response = await retryWithBackoff(() =>
      hubSpotClient.delete(`/crm/v3/objects/deals/${dealId}`)
    );
    return response.data;
  } catch (error) {
    handleHubSpotErrors(error);
  }
}

module.exports = {
  createHubSpotDeal,
  getHubSpotDeals,
  updateHubSpotDeal,
  deleteHubSpotDeal,
};