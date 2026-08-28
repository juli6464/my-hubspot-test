const hubSpotClient = require('../clients/hubSpotClient');
const { retryWithBackoff, handleHubSpotErrors } = require('../utils/handleErrors');

async function createHubSpotDeal(dealName, amount, pipeline, stage) {
  try {
    const properties = {
      dealname: dealName,
      amount: amount.toString(),
      hs_pipeline: pipeline,
      hs_stage: stage,
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
    const response = await retryWithBackoff(() =>
      hubSpotClient.get('/crm/v3/objects/deals', { params: { limit: 100 } })
    );
    return response.data.results || [];
  } catch (error) {
    handleHubSpotErrors(error);
  }
}

async function updateHubSpotDeal(dealId, properties) {
  try {
    const response = await retryWithBackoff(() =>
      hubSpotClient.patch(`/crm/v3/objects/deals/${dealId}`, { properties })
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