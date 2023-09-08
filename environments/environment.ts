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
  supabaseUrl: 'https://ckyrcbpzjsjxhtnzbyfc.supabase.co',
  supabaseKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNreXJjYnB6anNqeGh0bnpieWZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODY2NjU2ODYsImV4cCI6MjAwMjI0MTY4Nn0.ILYOEIZaMlkg-gWK49CZOUcA3S9KUR-9jkHhhdRWbmU',
};
