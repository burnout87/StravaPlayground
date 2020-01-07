import { OnInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WebSocketService } from './shared/web-socket.service';
import { Observable, throwError, Subject } from 'rxjs';
import { retry, catchError, map } from 'rxjs/operators';
import {environment} from '../environments/environment';
import { Athlete } from './shared/Athlete';
import { Activity } from './shared/Activity';

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
  private athleteActivities: Array<Activity> = new Array();
  private bc = new BroadcastChannel('tabsCommChannel');
  
  constructor(private activatedRoute: ActivatedRoute, private wsService: WebSocketService) { 
    // Example of a simple event handler that only
    // logs the event to the console
    this.bc.addEventListener('message', (event) => {
      var msg = JSON.parse(event.data);
      this.stateTitle = msg.stateTitle;
      if(this.state == "authorization" && msg.state == 'authorized') {
        this.state = msg.state;
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
        this.bc.postMessage(obj);
        window.close();
      }
    });
  }

  authorize() {
    this.wsService.authorize()
      .subscribe((data: string) => {
        this.windowHandleAuth = window.open(data, 'OAuth2 Login', "width=500, height=600, left=0, top=0");
        this.state = "authorization";
      });
  }

  getBearerToken(code: string, state: string, scope: string) {
    this.wsService.getBearerToken(code, state, scope)
      .subscribe((data) => {
        this.athleteData = new Athlete(
          data.athlete.id,
          data.athlete.username,
          data.athlete.firstname,
          data.athlete.lastname,
          data.athlete.city,
          data.athlete.state,
          data.athlete.country
        );
      });
  }

  updateAthleteActivitiesList() {
    this.wsService.getAthleteActivities()
      .subscribe((data) => {
        console.log(data);
        data.forEach((element: any)  => {
            this.athleteActivities.push(new Activity(
              element.id, element.name, element.distance, element.moving_time,
              element.elapsed_time, element.total_elevation_gain, element.type,
              element.workout_type, element.start_date, element.start_date,
              element.timezone, element.number, element.start_latlng, 
              element.end_latlng, element.loation_city, element.locatio_state,
              element.location_country
            ));
      });
    });
  }

}
