import { Injectable } from '@angular/core';
import * as Rx from "rxjs";
import { Observable, Subject } from 'rxjs';
import { flatMap } from "rxjs/operators";
import * as io from 'socket.io-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import * as L from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class ConnectivityService {

  // Our socket connection
  private socket: SocketIOClient.Socket;
  private messages: Subject<any>;

  constructor(private http: HttpClient) {  }

  private subject: Rx.Subject<MessageEvent>;

  public connect(url : string): Rx.Subject<MessageEvent> {

    this.socket = io(url);

    // We define our observable which will observe any incoming messages
    // from our socket.io server.
    let observable = new Observable(observer => {
        this.socket.on('message', (data: Object) => {
          console.log("Received message from Websocket Server");
          observer.next(data);
        })
        return () => {
          this.socket.disconnect();
        }
    });

    // We define our Observer which will listen to messages
    // from our other components and send messages back to our
    // socket server whenever the `next()` method is called.
    let observer = {
        next: (data: Object) => {
          console.log("next eseguito");
          this.socket.emit('message', { type: "new-message", text: (data) });
        },
    };

    // we return our Rx.Subject which is a combination
    // of both an observer and observable.
    return Rx.Subject.create(observer, observable);

  }

  public authorize(): Rx.Observable<string> {
    return this.http.get(environment.requestAuthorizationUrlAPI, {responseType: 'text'});
  }

  public getAuthorizationUrl(): string {
    var authorizationUrl: string = environment.authorizationBaseUrl + "?response_type=" + environment.responseType + "&client_id=" + environment.client_id;
    authorizationUrl += "&approval_prompt=" + environment.approval_prompt;
    authorizationUrl += "&redirect_uri=" + environment.callback_auth;
    authorizationUrl += "&state=authorized";
    authorizationUrl += "&scope=read,read_all,profile:read_all,profile:write,activity:read,activity:read_all,activity:write";

    return authorizationUrl;
  }

  public refreshToken(): Rx.Observable<any> {
    return this.http.post(environment.requestTokenRefreshing, {responseType: 'json'});
  }

  public getBearerToken(code: string, state: string, scope: string): Rx.Observable<any> {

    var data = {client_id: environment.client_id, client_secret: environment.client_secret, code: code, grant_type: 'authorization_code'};
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    // var endpoint: string = environment.getAuthenticationInfo += "?code=" + code + "&state=" + state + "&scope=" + scope;
    // return this.http.get(endpoint);

    return this.http.post(environment.getAccessTokenEndpoint, data, httpOptions);
  }

  public getAthleteActivitiesFrom(beginning: moment.Moment): Rx.Observable<any> {
    var nowEpoch = moment().unix();
    var nowEpochLessAMonth = beginning.unix();
    var endpoint: string = environment.getAthleteActivities + "?before=" + nowEpoch + "&after=" + nowEpochLessAMonth + "&page=" + 1 + "&per_page=" + 200;
    return this.http.get(endpoint);
  }

  public getAthleteActivitiesInclusionArea(beginning: moment.Moment, end: moment.Moment, bounds: L.LatLngBounds): Rx.Observable<any> {
    var beginSecs = beginning.unix();
    var endSecs = end.unix();
    
    var corn1 = {lat: bounds.getNorth(), lng: bounds.getWest()};
    var corn2 = {lat: bounds.getSouth(), lng: bounds.getEast()};
    /**
     * pointVec[0] is the NorthWest point
     * pointVec[1] is the SouthEast point
     */
    var pointVec = [corn1, corn2];

    var endpoint: string = environment.getAthleteActivitiesInclusionArea 
                + "?before=" +  endSecs
                + "&after=" + beginSecs 
                + "&page=" + 1 
                + "&per_page=" + 200;

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
    };
    return this.http.post(endpoint, pointVec, httpOptions);
  }

  public updateAccessTokenData(access_token: string, refresh_token: string, expires_at: string, expires_in: string): Rx.Observable<any> {
    var data = {access_token: access_token, refresh_token: refresh_token, expires_at: expires_at, expires_in: expires_in};
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    return this.http.post(environment.updateAccessTokenDataEndpoint, data, httpOptions);
  }

  public getAthleteActivitiesIntersectionArea(
    beginning: moment.Moment, 
    end: moment.Moment, 
    bounds: L.LatLngBounds,
    type: string,
    percentage: Number): Rx.Observable<any> {
    var beginSecs = beginning.unix();
    var endSecs = end.unix();
    
    var corn1 = {lat: bounds.getNorth(), lng: bounds.getWest()};
    var corn2 = {lat: bounds.getSouth(), lng: bounds.getEast()};
    /**
     * pointVec[0] is the NorthWest point
     * pointVec[1] is the SouthEast point
     */
    var pointVec = [corn1, corn2];

    var endpoint: string = environment.getAthleteActivitiesIntersectionArea 
                + "?before=" +  endSecs
                + "&after=" + beginSecs 
                + "&page=" + 1 
                + "&per_page=" + 200
                + "&percentage=" + percentage
                + "&type=" + type;

    const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json'
        })
    };
    return this.http.post(endpoint, pointVec, httpOptions);
  }

  public getAuthorizationState(): Rx.Observable<any> {
    var endpoint: string = environment.getAuthorizationState;
    return this.http.get(endpoint);
  }

  public getAthleteInfo(): Rx.Observable<any> {

    // get the access token
    return this.http.post(environment.getAccessTokenInfoEndPoint, ['access_token'])
      .pipe(
        flatMap((data: any) => {
          console.log(data);
          const httpOptions = {
            headers: new HttpHeaders({
              'Authorization':  'Bearer ' + data.access_token
            })
          };
          return this.http.get(environment.getAthleteInfoEndPoint_2, httpOptions);
        })
      );



      // .subscribe(
      //   (data) => {
      //     console.log(data);
      //     const httpOptions = {
      //       headers: new HttpHeaders({
      //         'Authorization':  'Bearer ' + data
      //       })
      //     };
      //     return this.http.get(environment.getAthleteInfoEndPoint_2, httpOptions);
      //   },
      //   (error) => {
      //     console.error('error getting token data ' + error);
      //     return null;
      //   });


  }
}
