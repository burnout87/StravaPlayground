import { Injectable } from '@angular/core';
import * as Rx from "rxjs";
import { Observable, Subject } from 'rxjs';
import * as io from 'socket.io-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Athlete } from './Athlete';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

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

  public refreshToken(): Rx.Observable<any> {
    return this.http.post(environment.requestTokenRefreshing, {responseType: 'json'});
  }

  public getBearerToken(code: string, state: string, scope: string): Rx.Observable<any> {
    var endpoint: string = environment.getAuthenticationInfo += "?code=" + code + "&state=" + state + "&scope=" + scope;
    return this.http.get(endpoint);
  }

  public getAthleteActivitiesFrom(beginning: moment.Moment): Rx.Observable<any> {
    var nowEpoch = moment().unix();
    var nowEpochLessAMonth = beginning.unix();
    var endpoint: string = environment.getAthleteActivities + "?before=" + nowEpoch + "&after=" + nowEpochLessAMonth + "&page=" + 1 + "&per_page=" + 200;
    return this.http.get(endpoint);
  }

  public getAthleteActivitiesAreaFrom(beginning: moment.Moment): Rx.Observable<any> {
    var nowEpoch = moment().unix();
    var nowEpochLessAMonth = beginning.unix();
    
    var corn1 = {lat: '12', lng: '13'};
    var corn2 = {lat: '14', lng: '14'};

    var pointVec = [corn1, corn2];

    var endpoint: string = environment.getAthleteActivitiesArea 
                + "?before=" + nowEpoch 
                + "&after=" + nowEpochLessAMonth 
                + "&page=" + 1 
                + "&per_page=" + 200;

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
    var endpoint: string = environment.getAthleteInfo;
    return this.http.get(endpoint);
  }
}
