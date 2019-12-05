import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from './shared/web-socket.service';
import { Observable, throwError, Subject } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import {environment} from '../environments/environment';
import { Athlete } from './shared/athlete';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private windowHandleAuth;
  private stateTitle = "Authorize/authenticate!!!";
  private state = "main";
  private messages: Subject<any>;
  private authSent: boolean;
  private athleteData: Athlete = null;

  constructor(private activatedRoute: ActivatedRoute, private wsService: WebSocketService) { 
    this.messages = <Subject<any>>wsService.connect(environment.ws_url)
      .pipe(map((response: any): any => {
        return response;
      }));
    this.messages.subscribe(msg => {
        console.log("data arrived fron the server");
        console.log(msg.text.text);
        msg = JSON.parse(msg.text.text);
        this.stateTitle = msg.stateTitle;
        if(this.stateTitle == "Authorized!" && this.state == "authorized")
          window.close();
        else if(this.stateTitle == "Authorized!" && this.state == "authorization") {
          this.state = 'authorized';
          this.getBearerToken(msg.code, msg.state, msg.scope);
        }
          
      });
   }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if(params['code'] && params['scope']) {
        this.state = 'authorized';
        const code = params['code'];
        const scope = params['scope'];
        const state = params['state'];
        
        this.stateTitle = "Authorized!"

        let obj = JSON.stringify( {
          "code": code,
          "scope": scope,
          "state": state,
          "stateTitle": this.stateTitle
        });
        this.messages.next(obj);
      }
    });
  }

  authorize() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log("Redirecting to strava login/authorization");
          this.windowHandleAuth = window.open(xhr.response, 'OAuth2 Login', "width=500, height=600, left=0, top=0");
          this.state = "authorization";
        }
      } else {
          console.log("Error requesting the authorization URL");
      }
    };
    xhr.open('GET', environment.requestAuthorizationUrlAPI, true);
    xhr.send();
  }

  getBearerToken(code: string, state: string, scope: string) {
    environment.sendCodeToBackEnd += "?code=" + code + "&state=" + state + "&scope=" + scope;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            let obj = JSON.parse(xhr.response);
            this.athleteData = new Athlete(
              obj.athlete.id,
              obj.athlete.username,
              obj.athlete.firstname,
              obj.athlete.lastname,
              obj.athlete.city,
              obj.athlete.state,
              obj.athlete.country
            );
        }
      } else {
          console.log("Error sending the code to the backend");
      }
    };
    xhr.open('GET', environment.sendCodeToBackEnd, true);
    xhr.send();
  }

}
