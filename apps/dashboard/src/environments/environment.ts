import { ConfigurationInterface } from '../app/core/configuration/interfaces/configuration.interface';

export const environment: ConfigurationInterface = {
  production: false,
  apiHost: 'http://localhost:3200',
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'budget-app',
    clientId: 'frontend',
  },
};
