function handleHubSpotErrors(error) {
  const response = error.response;
  if (response) {
    // Log seguro sin exponer tokens o cabeceras sensibles
    const safeError = {
      status: response.status,
      statusText: response.statusText,
      message: response.data?.message || error.message,
      correlationId: response.headers?.['x-hubspot-correlation-id'],
    };
    console.error('[HubSpot Error Details]:', JSON.stringify(safeError, null, 2));
    throw new Error(`HubSpot API Error: ${safeError.message} (Status: ${safeError.status})`);
  } else if (error.request) {
    console.error('[Network Error]: No se recibió respuesta de HubSpot', error.message);
    throw new Error('Error de red o timeout al conectar con HubSpot.');
  } else {
    console.error('[Error]:', error.message);
    throw error;
  }
}

async function retryWithBackoff(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    const status = error.response?.status;
    const isRateLimit = status === 429;
    const isServerError = status >= 500 && status < 600;

    if ((isRateLimit || isServerError) && retries > 0) {
      console.warn(`[Warning] Error ${status} detectado. Reintentando en ${delay}ms... (${retries} intentos restantes)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

module.exports = { handleHubSpotErrors, retryWithBackoff };