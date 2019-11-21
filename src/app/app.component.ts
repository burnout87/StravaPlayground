import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'StravaPlayground';
  requestAuthorizationUrlAPI = 'http://localhost:8080/getAuthenticationUrl';

  authorize() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          window.open(xhr.response, "_blank");
        } else {
          console.log(xhr.response);
        }
      }
    };
    xhr.open('GET', this.requestAuthorizationUrlAPI, true);
    xhr.send();
  }
}
