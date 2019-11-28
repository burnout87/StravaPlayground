import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { WindowService } from "./window.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private requestAuthorizationUrlAPI = 'http://localhost:8080/getAuthenticationUrl';
  private sendCodeToBackEnd = 'http://localhost:8080/getResponseAuthenticationUrl/';
  private windowHandleAuth;
  private stateTitle = "Authorize/authenticate!!!";

  constructor(private activatedRoute: ActivatedRoute) {  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log(params);
      if(params['code'] && params['scope']) {

        const code = params['code'];
        const scope = params['scope'];
        const state = params['state'];
        this.sendCodeToBackEnd += "?code=" + code + "&state=" + state + "&scope=" + scope;
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              this.stateTitle = "Authorized!"
              window.close();
            }
          } else {
              console.log("Error sending the code to the backend");
          }
        };
        xhr.open('GET', this.sendCodeToBackEnd, true);
        xhr.send();
      }
    });
  }

  // use local storage for messaging. Set message in local storage and clear it right away
  // This is a safe way how to communicate with other tabs while not leaving any traces
  //
  message_broadcast(message)
  {
      localStorage.setItem('message',JSON.stringify(message));
      localStorage.removeItem('message');
  }


  // receive message
  //
  message_receive(ev)
  {
      if (ev.originalEvent.key!='message') return; // ignore other keys
      var message=JSON.parse(ev.originalEvent.newValue);
      if (!message) return; // ignore empty msg or msg reset

      // here you act on messages.
      // you can send objects like { 'command': 'doit', 'data': 'abcd' }
      if (message.command == 'doit') alert(message.data);

      // etc.
  }

  onLoadSuccess() {
          console.log("to close the tab");
      }

  authorize() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log("Redirecting to strava login/authorization");
          this.windowHandleAuth = window.open(xhr.response, 'OAuth2 Login', "width=500, height=600, left=0, top=0");
        }
      } else {
          console.log("Error requesting the authorization URL");
      }
    };
    xhr.open('GET', this.requestAuthorizationUrlAPI, true);
    xhr.send();
  }

}
