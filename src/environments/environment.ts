// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ws_url: 'ws://localhost:3100',
  requestAuthorizationUrlAPI: 'http://localhost:8080/getAuthenticationUrl',
  requestTokenRefreshing: 'http://localhost:8080/refreshAccessToken',
  getAuthenticationInfo: 'http://localhost:8080/getAuthenticationInfo/',
  getAccessTokenEndpoint: 'https://www.strava.com/oauth/token',
  updateAccessTokenDataEndpoint: 'http://localhost:8080/updateAccessTokenData/',
  getAthleteActivities: 'http://localhost:8080/getActivities/',
  getAthleteActivitiesInclusionArea: 'http://localhost:8080/getActivitiesInclusionArea/',
  getAthleteActivitiesIntersectionArea: 'http://localhost:8080/getActivitiesIntersectionArea/',
  getAuthorizationState: 'http://localhost:8080/getAuthorizationState/',
  getAthleteInfoEndPoint: 'http://localhost:8080/getAthleteInfo/',
  getAthleteInfoEndPoint_2: 'https://www.strava.com/api/v3/athlete',
  getAccessTokenInfoEndPoint: 'http://localhost:8080/getAccessTokenInfo/',
  prop: "strProp-value",
  client_id: '40265',
  client_secret: '40a7218d4d32b62065ae917362c9e496b17b5e67',
  approval_prompt: 'auto',
  responseType: 'code',
  callback_auth: 'http://localhost:4200',
  authorizationBaseUrl: 'https://www.strava.com/oauth/authorize'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

