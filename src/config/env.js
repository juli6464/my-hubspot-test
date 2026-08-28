require('dotenv').config();

const requiredEnv = ['HUBSPOT_ACCESS_TOKEN'];
for (const env of requiredEnv) {
  if (!process.env[env]) {
    throw new Error(`Falta la variable de entorno obligatoria: ${env}`);
  }
}

module.exports = {
  hubspotAccessToken: process.env.HUBSPOT_ACCESS_TOKEN,
  pipelineId: process.env.HUBSPOT_PIPELINE_ID || 'default',
  stageId: process.env.HUBSPOT_STAGE_ID || 'appointmentscheduled',
};