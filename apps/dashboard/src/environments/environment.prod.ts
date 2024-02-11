import { ConfigurationInterface } from '../app/core/configuration/interfaces/configuration.interface';

export const environment: ConfigurationInterface = {
  production: true,
  apiHost: 'https://api-budget.devhub.me',
  keycloak: {
    url: 'https://auth.devhub.me',
    realm: 'budget-app',
    clientId: 'dashboard',
  },
};
