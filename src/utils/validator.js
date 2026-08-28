function validateContact(properties) {
  if (!properties || typeof properties !== 'object') {
    throw new Error('El payload del contacto debe ser un objeto válido.');
  }
  if (!properties.email) {
    throw new Error('El campo "email" es obligatorio para crear o actualizar un contacto en HubSpot.');
  }
  return true;
}

function validateDeal(properties) {
  if (!properties || typeof properties !== 'object') {
    throw new Error('El payload del negocio (deal) debe ser un objeto válido.');
  }
  if (!properties.dealname) {
    throw new Error('El campo "dealname" es obligatorio para el negocio.');
  }
  if (properties.amount === undefined || properties.amount === null) {
    throw new Error('El campo "amount" es obligatorio para el negocio.');
  }
  return true;
}

module.exports = {
  validateContact,
  validateDeal,
};