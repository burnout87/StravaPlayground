import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'StravaPlayground';
  urlAuthorization = 'http://www.strava.com/oauth/authorize?client_id=40265&' +
  'response_type=code&' +
  'redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=read';

  authorize() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // resolve(JSON.parse(xhr.response))
          console.log(xhr.response);
        } else {
          console.log(xhr.response);
        }
      }
    };
    xhr.open('GET', this.urlAuthorization, true);
    xhr.send();
  }
}
