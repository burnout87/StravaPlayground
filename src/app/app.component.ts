import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'StravaPlayground';
  requestAuthorizationUrlAPI = 'http://localhost:8080/getAuthenticationUrl';

  onAuthSuccess(authSuccessUrl) {    
        window.onClose(authSuccessUrl);
    }
  
  authorize() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
<<<<<<< HEAD
          window.open(xhr.response, "_blank");
        } else {
          console.log(xhr.response);
        }
=======
          // resolve(JSON.parse(xhr.response))
          console.log(xhr.response);
          authWindow = window.open(xhr.response, "_blank");
          $.ajax({
                  url: "/auth/google/",
                  type: "POST",
                  data: {username : uname, password: pass}                      
                }).success(function(data){
                    var redirectUrl = data.url; // or "/home" as you had mentioned
                    onAuthSuccess(redirectUrl);
                });
          } else {
            console.log(xhr.response);
          }
>>>>>>> 43856190c4b9c2bc51cdab3acd4e25f8171e53b2
      }
    };
    xhr.open('GET', this.requestAuthorizationUrlAPI, true);
    xhr.send();
  }
}
