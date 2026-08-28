const hubSpotClient = require('../clients/hubSpotClient');
const { retryWithBackoff, handleHubSpotErrors } = require('../utils/handleErrors');

async function getHubSpotContactNames() {
  let allNames = [];
  let after = undefined;

  try {
    do {
      const response = await retryWithBackoff(() =>
        hubSpotClient.get('/crm/v3/objects/contacts', {
          params: { limit: 100, after, properties: 'firstname,lastname' },
        })
      );

      const contacts = response.data.results || [];
      const names = contacts.map((c) => {
        const first = c.properties.firstname || '';
        const last = c.properties.lastname || '';
        return `${first} ${last}`.trim() || 'Sin Nombre';
      });

      allNames.push(...names);
      after = response.data.paging?.next?.after;
    } while (after);

    return allNames;
  } catch (error) {
    handleHubSpotErrors(error);
  }
}

async function getHubSpotContacts() {
  try {
    const response = await retryWithBackoff(() =>
      hubSpotClient.get('/crm/v3/objects/contacts', { params: { limit: 100 } })
    );
    return response.data.results || [];
  } catch (error) {
    handleHubSpotErrors(error);
  }
}

async function createHubSpotContact(properties) {
  try {
    const response = await retryWithBackoff(() =>
      hubSpotClient.post('/crm/v3/objects/contacts', { properties })
    );
    return response.data;
  } catch (error) {
    handleHubSpotErrors(error);
  }
}

async function updateHubSpotContact(contactId, properties) {
  try {
    const response = await retryWithBackoff(() =>
      hubSpotClient.patch(`/crm/v3/objects/contacts/${contactId}`, { properties })
    );
    return response.data;
  } catch (error) {
    handleHubSpotErrors(error);
  }
}

async function deleteHubSpotContact(contactId) {
  try {
    const response = await retryWithBackoff(() =>
      hubSpotClient.delete(`/crm/v3/objects/contacts/${contactId}`)
    );
    return response.data;
  } catch (error) {
    handleHubSpotErrors(error);
  }
}

module.exports = {
  getHubSpotContactNames,
  getHubSpotContacts,
  createHubSpotContact,
  updateHubSpotContact,
  deleteHubSpotContact,
};