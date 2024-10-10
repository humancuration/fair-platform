const Keycloak = require('keycloak-connect');
const session = require('express-session');

let _keycloak;

const keycloakConfig = {
  clientId: process.env.KEYCLOAK_CLIENT_ID,
  bearerOnly: true,
  serverUrl: process.env.KEYCLOAK_AUTH_SERVER_URL,
  realm: process.env.KEYCLOAK_REALM,
  credentials: {
    secret: process.env.KEYCLOAK_CLIENT_SECRET
  }
};

function initKeycloak() {
  if (_keycloak) {
    console.warn("Trying to init Keycloak again!");
    return _keycloak;
  } 
  
  console.log("Initializing Keycloak...");
  const memoryStore = new session.MemoryStore();
  _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
  return _keycloak;
}

function getKeycloak() {
  if (!_keycloak){
    console.error('Keycloak has not been initialized. Please called init first.');
  } 
  return _keycloak;
}

module.exports = {
  initKeycloak,
  getKeycloak
};