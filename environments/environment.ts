export const environment = {
  production: false,
  apiHost: 'http://localhost:3200',
  auth0Domain: 'dev-ykxhygep516pvs5l.uk.auth0.com',
  auth0ClientId: 'K2zecLslX2T8tcDTKaAiEkm07QcWxw2C',
  auth0Audience: 'http://localhost:3200',
  auth0HttpInterceptorConfig: [
    {
      uri: 'http://localhost:3200/*',
      tokenOptions: {
        authorizationParams: {
          audience: 'http://localhost:3200',
          scope: 'read:current_user',
        },
      },
    },
  ],
};
