import Keycloak from 'keycloak-connect';
import session from 'express-session';

let _keycloak: Keycloak.Keycloak | undefined;

interface ExtendedKeycloakConfig extends Keycloak.KeycloakConfig {
  clientId: string; // Ensure clientId is included
  bearerOnly: boolean; // Ensure this is a boolean
  serverUrl: string; // Add this line to include serverUrl
  realm: string; // Add this line to include realm
  credentials: { // Add this line to include credentials
    secret: string; // Ensure secret is a string
  };
}

const keycloakConfig: ExtendedKeycloakConfig = {
  clientId: process.env.KEYCLOAK_CLIENT_ID!,
  bearerOnly: true, // Ensure this is a boolean
  serverUrl: process.env.KEYCLOAK_AUTH_SERVER_URL!, // Add this line
  realm: process.env.KEYCLOAK_REALM!, // Add this line
  credentials: {
    secret: process.env.KEYCLOAK_CLIENT_SECRET! // Ensure secret is a string
  },
  'confidential-port': 0, // Add this line (set to 0 if not used)
  'auth-server-url': process.env.KEYCLOAK_AUTH_SERVER_URL!, // Add this line
  resource: process.env.KEYCLOAK_RESOURCE!, // Add this line
  'ssl-required': 'external' // Add this line (set according to your needs)
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
