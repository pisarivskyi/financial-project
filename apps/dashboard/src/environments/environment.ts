import { ConfigurationInterface } from '../app/core/configuration/interfaces/configuration.interface';

export const environment: ConfigurationInterface = {
  production: false,
  apiHost: 'http://budget.localhost',
  keycloak: {
    url: 'http://budget.localhost/auth',
    realm: 'budget-app',
    clientId: 'dashboard',
  },
};
