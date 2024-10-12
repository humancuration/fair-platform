import Keycloak from 'keycloak-connect';
import session from 'express-session';

let _keycloak: Keycloak.Keycloak | undefined;

const keycloakConfig: Keycloak.KeycloakConfig = {
  clientId: process.env.KEYCLOAK_CLIENT_ID!,
  bearerOnly: true,
  serverUrl: process.env.KEYCLOAK_AUTH_SERVER_URL!,
  realm: process.env.KEYCLOAK_REALM!,
  credentials: {
    secret: process.env.KEYCLOAK_CLIENT_SECRET!
  }
};

function initKeycloak(): Keycloak.Keycloak {
  if (_keycloak) {
    console.warn("Trying to init Keycloak again!");
    return _keycloak;
  } 
  
  console.log("Initializing Keycloak...");
  const memoryStore = new session.MemoryStore();
  _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
  return _keycloak;
}

function getKeycloak(): Keycloak.Keycloak {
  if (!_keycloak){
    throw new Error('Keycloak has not been initialized. Please call init first.');
  } 
  return _keycloak;
}

export {
  initKeycloak,
  getKeycloak
};
