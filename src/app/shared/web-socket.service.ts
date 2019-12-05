import { Injectable } from '@angular/core';
import * as Rx from "rxjs";
import { Observable, Subject } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  // Our socket connection
  private socket: SocketIOClient.Socket;
  private messages: Subject<any>;

  constructor(public router: Router) {  }

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
}
