export const environment = {
  production: true,
  apiHost: 'https://api-budget.devhub.me',
  auth0Domain: 'dev-ykxhygep516pvs5l.uk.auth0.com',
  auth0ClientId: 'K2zecLslX2T8tcDTKaAiEkm07QcWxw2C',
  auth0Audience: 'https://api-budget.devhub.me',
  auth0HttpInterceptorConfig: [
    {
      uri: 'https://api-budget.devhub.me/*',
      tokenOptions: {
        authorizationParams: {
          audience: 'https://api-budget.devhub.me',
          scope: 'read:current_user',
        },
      },
    },
  ],
};
