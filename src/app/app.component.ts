import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'StravaPlayground';
  requestAuthorizationUrlAPI = 'http://localhost:8080/getAuthenticationUrl';

  onLoadSuccess() {
          console.log("to close the tab");
      }

  authorize() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log(xhr.response);
          var authWindow = window.open(xhr.response);
        }
      } else {
          console.log("Error");
      }
    };
    xhr.open('GET', this.requestAuthorizationUrlAPI, true);
    xhr.send();
  }
}
