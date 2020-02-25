// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ws_url: 'ws://localhost:3100',
  requestAuthorizationUrlAPI: 'http://localhost:8080/getAuthenticationUrl',
  requestTokenRefreshing: 'http://localhost:8080/refreshAccessToken',
  getAuthenticationInfo: 'http://localhost:8080/getAuthenticationInfo/',
  getAthleteActivities: 'http://localhost:8080/getActivities/',
  getAthleteActivitiesArea: 'http://localhost:8080/getActivitiesArea/',
  getAuthorizationState: 'http://localhost:8080/getAuthorizationState/',
  getAthleteInfo: 'http://localhost:8080/getAthleteInfo/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
