import { KeycloakConfig } from 'keycloak-js';

export interface ConfigurationInterface {
  production: boolean;
  apiHost: string;
  keycloak: KeycloakConfig;
}
