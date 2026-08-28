const axios = require('axios');
const { hubspotAccessToken } = require('../config/env');

const hubSpotClient = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${hubspotAccessToken}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

module.exports = hubSpotClient;