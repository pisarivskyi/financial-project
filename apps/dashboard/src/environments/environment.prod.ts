export const environment = {
  production: true,
  apiHost: 'https://api-budget.devhub.me',
  auth0Domain: 'budget.uk.auth0.com',
  auth0ClientId: 'x6CusJRLOKUuiHOg5ovNvTwd9W77OLC3',
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
